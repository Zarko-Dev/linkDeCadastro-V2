const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

export type ApiErrorPayload = {
  message: string;
  status?: number;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export class ApiFetchError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiFetchError';
    this.status = status;
    this.payload = payload;
  }
}

const ACCESS_TOKEN_KEY = 'v2_access_token';
const USER_KEY = 'v2_user';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getAccessToken() {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): SessionUser | null {
  if (!isBrowser()) return null;

  const rawUser = window.sessionStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    const parsed = JSON.parse(rawUser) as Partial<SessionUser>;
    if (!parsed?.id || !parsed.email || !parsed.name || !parsed.role) {
      return null;
    }

    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export function saveSession(session: { accessToken: string; user: SessionUser }) {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

function shouldSetJsonContentType(body: BodyInit | null | undefined) {
  if (!body) return false;

  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return false;
  }

  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return false;
  }

  if (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) {
    return false;
  }

  return true;
}

async function request(path: string, init?: RequestInit, token?: string | null) {
  const headers = new Headers(init?.headers);

  if (shouldSetJsonContentType(init?.body) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });
}

async function refreshSession() {
  const response = await request('/v2/auth/refresh', { method: 'POST' });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const payload = (await response.json()) as {
    accessToken: string;
    user: SessionUser;
  };

  saveSession(payload);
  return payload.accessToken;
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const candidate = payload as {
    message?: unknown;
    error?: unknown;
    statusCode?: unknown;
  };

  if (Array.isArray(candidate.message)) {
    const messages = candidate.message.filter((item): item is string => typeof item === 'string');
    if (messages.length) {
      return messages.join(' ');
    }
  }

  if (typeof candidate.message === 'string' && candidate.message.trim()) {
    return candidate.message;
  }

  if (typeof candidate.error === 'string' && candidate.error.trim()) {
    return candidate.error;
  }

  return fallback;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let token = getAccessToken();
  let response = await request(path, init, token);

  if (
    response.status === 401 &&
    isBrowser() &&
    !path.startsWith('/v2/auth/login') &&
    !path.startsWith('/v2/auth/refresh')
  ) {
    token = await refreshSession();
    if (token) {
      response = await request(path, init, token);
    }
  }

  if (!response.ok) {
    const fallbackMessage = `API request failed: ${response.status}`;
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const message = extractErrorMessage(payload, fallbackMessage);
    const error: ApiErrorPayload = { message, status: response.status };
    throw new ApiFetchError(message, response.status, payload ?? error);
  }

  return response.json() as Promise<T>;
}
