'use client';

import { FormEvent, useState } from 'react';
import { apiFetch, clearSession, saveSession } from '@/shared/lib/api';
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
  const [email, setEmail] = useState('admin@linkdecadastro.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('Autenticando acesso...');

    try {
      const result = await apiFetch<LoginResponse>('/v2/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      saveSession({
        accessToken: result.accessToken,
        user: result.user,
      });
      setMessage(`Autenticado como ${result.user.name}.`);
    } catch {
      clearSession();
      setMessage('Falha no login.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-layout hero-surface">
      <FadeIn className="auth-hero" delay={0.04}>
        <p className="eyebrow">Acesso rapido</p>
        <h2>Entrar na V2 sem atrito.</h2>
        <p>
          A experiencia de login precisa ser rapida no celular, clara no desktop e coerente com
          a linguagem premium da plataforma.
        </p>

        <div className="pill-row">
          <span className="pill">Sessao segura</span>
          <span className="pill pill-ghost">Mobile first</span>
          <span className="pill pill-ghost">Workspace de IA</span>
        </div>

        <div className="quick-actions" style={{ marginTop: 18 }}>
          <div className="quick-action">
            <span className="quick-action-label">Entrar e continuar</span>
            <span className="quick-action-meta">Login direto para dashboard, chat ou builders.</span>
          </div>
          <div className="quick-action">
            <span className="quick-action-label">Sessao rapida</span>
            <span className="quick-action-meta">Acesso repetido com pouca friccao no dia a dia.</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="auth-card" delay={0.1}>
        <div className="auth-card-top">
          <strong>Login V2</strong>
          <span className="agent-status agent-active">Pronto</span>
        </div>

        <form className="stack form-grid auth-form" onSubmit={handleSubmit}>
          <StaggerGroup className="stack" delayChildren={0.04} staggerChildren={0.06}>
            <StaggerItem>
              <label className="field-block">
                <span>Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
            </StaggerItem>
            <StaggerItem>
              <label className="field-block">
                <span>Senha</span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Senha"
                  type="password"
                  autoComplete="current-password"
                />
              </label>
            </StaggerItem>
            <StaggerItem>
              <button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? 'Entrando...' : 'Entrar'}
              </button>
            </StaggerItem>
          </StaggerGroup>
        </form>

        <div className="helper-panel" role="status" aria-live="polite">
          <small>Sessao segura, acesso operacional e caminho direto para o workspace.</small>
          <p>{message || 'Fluxo inicial reservado para autenticacao na nova plataforma.'}</p>
        </div>

      </FadeIn>
    </section>
  );
}
