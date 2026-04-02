const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type ApiErrorPayload = {
  message: string;
  status?: number;
};

const ACCESS_TOKEN_KEY = 'v2_access_token';
const USER_KEY = 'v2_user';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getAccessToken() {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveSession(session: { accessToken: string; user: unknown }) {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

async function request(path: string, init?: RequestInit, token?: string | null) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
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
    user: unknown;
  };

  saveSession(payload);
  return payload.accessToken;
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
    let message = `API request failed: ${response.status}`;
    try {
      const parsed = await response.json();
      message = parsed?.message || message;
    } catch {
      // keep fallback message
    }
    const error: ApiErrorPayload = { message, status: response.status };
    throw error;
  }

  return response.json() as Promise<T>;
}
