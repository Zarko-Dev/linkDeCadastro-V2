'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';

import brandLogo from '../../../assets/Logo.png';
import { ApiFetchError, apiFetch, clearSession, getAccessToken, saveSession } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@linkdecadastro.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string>('Use suas credenciais para abrir o painel operacional.');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (getAccessToken()) {
      router.replace('/dashboard');
    }
  }, [router]);

  function validateForm() {
    const nextErrors: { email?: string; password?: string } = {};
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail) {
      nextErrors.email = 'Informe o e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = 'Use um e-mail válido.';
    }

    if (!normalizedPassword) {
      nextErrors.password = 'Informe a senha.';
    } else if (normalizedPassword.length < 8) {
      nextErrors.password = 'A senha precisa ter pelo menos 8 caracteres.';
    }

    setFieldErrors(nextErrors);
    return {
      isValid: Object.keys(nextErrors).length === 0,
      normalizedEmail,
      normalizedPassword,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateForm();

    if (!validation.isValid) {
      setMessage('Corrija os campos destacados para continuar.');
      return;
    }

    setSubmitting(true);
    setMessage('Autenticando acesso...');

    try {
      const result = await apiFetch<LoginResponse>('/v2/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: validation.normalizedEmail,
          password: validation.normalizedPassword,
        }),
      });

      saveSession({
        accessToken: result.accessToken,
        user: result.user,
      });
      setMessage(`Autenticado como ${result.user.name}. Redirecionando...`);
      router.replace('/dashboard');
    } catch (error) {
      clearSession();
      const errorMessage =
        error instanceof ApiFetchError
          ? error.message
          : 'Nao foi possivel autenticar agora.';
      setMessage(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="login-modern-shell">
      <div className="login-lightning-container">
        <div className="lightning-bolt lightning-1"></div>
        <div className="lightning-bolt lightning-2"></div>
        <div className="lightning-bolt lightning-3"></div>
        <div className="lightning-bolt lightning-4"></div>
        <div className="lightning-bolt lightning-5"></div>
        <div className="lightning-bolt lightning-6"></div>
        <div className="lightning-bolt lightning-7"></div>
        <div className="lightning-bolt lightning-8"></div>
      </div>

      <FadeIn delay={0.04}>
        <article className="login-modern-card login-standalone-card wider-card">
          <div className="login-modern-card-head header-minimal">
            <div className="logo-only-wrap">
              <Image src={brandLogo} alt="Logo ZYRO" className="brand-logo-image brand-logo-image-login-card-large" priority />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="console-stack">
            <StaggerGroup className="console-stack" delayChildren={0.04} staggerChildren={0.05}>
              <StaggerItem>
                <label className="console-field">
                  <span>E-mail de acesso</span>
                  <div className="login-input-wrap">
                    <Mail size={18} className="login-input-icon" />
                    <input
                      className="login-modern-input"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors((current) => ({ ...current, email: undefined }));
                        }
                      }}
                      placeholder="admin@linkdecadastro.com"
                      type="email"
                      autoComplete="email"
                      required
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                    />
                  </div>
                  {fieldErrors.email ? (
                    <small id="login-email-error" className="field-error-message">
                      {fieldErrors.email}
                    </small>
                  ) : null}
                </label>
              </StaggerItem>

              <StaggerItem>
                <label className="console-field">
                  <span>Senha</span>
                  <div className="login-input-wrap">
                    <Lock size={18} className="login-input-icon" />
                    <input
                      className="login-modern-input"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors((current) => ({ ...current, password: undefined }));
                        }
                      }}
                      placeholder="Digite sua senha"
                      type="password"
                      autoComplete="current-password"
                      required
                      minLength={8}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                    />
                  </div>
                  {fieldErrors.password ? (
                    <small id="login-password-error" className="field-error-message">
                      {fieldErrors.password}
                    </small>
                  ) : null}
                </label>
              </StaggerItem>

              <StaggerItem className="centered-action">
                <button className="login-modern-primary centered-button" type="submit" disabled={submitting}>
                  {submitting ? 'Entrando...' : 'Fazer login'}
                  <ArrowRight size={18} />
                </button>
              </StaggerItem>
            </StaggerGroup>
          </form>

          <div className="login-modern-footer">
            <p aria-live="polite" className={message ? 'has-message' : ''}>
              {message}
            </p>
            <div className="login-modern-links">
              <span>Acesso protegido</span>
              <span>Refresh via cookie</span>
              <span>Redirecionamento automatico</span>
            </div>
          </div>
        </article>
      </FadeIn>
    </section>
  );
}
