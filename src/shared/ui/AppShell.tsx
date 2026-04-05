'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bot,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

import { AnimatedPage } from '@/shared/ui/motion/MotionPrimitives';
import {
  apiFetch,
  clearSession,
  getAccessToken,
  getStoredUser,
  type SessionUser,
} from '@/shared/lib/api';
import brandLogo from '../../../assets/Logo.png';

type AppShellProps = {
  children: ReactNode;
};

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
};

type QuickLink = {
  label: string;
  href: string;
};

const navItems: readonly NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Usuarios', icon: Users },
  { to: '/agents', label: 'Agentes', icon: Bot },
  { to: '/events', label: 'Eventos', icon: FolderOpen },
  { to: '/integrations', label: 'Configuracoes', icon: Settings },
  { to: '/automations', label: 'Automacoes', icon: Sparkles },
  { to: '/form', label: 'Formularios', icon: Shield },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
] as const;

const quickLinks: readonly QuickLink[] = [
  { label: 'Login', href: '/login' },
  { label: 'Cursos', href: '/courses' },
  { label: 'Eventos', href: '/events' },
  { label: 'Automacoes', href: '/automations' },
] as const;

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [signOutMessage, setSignOutMessage] = useState('Sessao ativa');
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    const accessToken = getAccessToken();

    if (!storedUser || !accessToken) {
      clearSession();
      setSessionUser(null);
      setAuthResolved(true);
      router.replace('/login');
      return;
    }

    setSessionUser(storedUser);
    setAuthResolved(true);
  }, [router]);

  if (!authResolved) {
    return (
      <div className="obsidian-shell">
        <main className="obsidian-main">
          <section className="obsidian-dashboard">
            <section className="obsidian-stage-panel obsidian-overview-panel">
              <div className="obsidian-overview-head">
                <div className="obsidian-overview-copy">
                  <h1>Validando sessao</h1>
                  <p>Verificando acesso atual.</p>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    );
  }

  async function handleSignOut() {
    setSignOutMessage('Encerrando sessao...');

    try {
      await apiFetch('/v2/auth/logout', { method: 'POST' });
    } catch {
      // Logout local ainda precisa funcionar se a API nao responder.
    } finally {
      clearSession();
      router.replace('/login');
    }
  }

  return (
    <div className={sidebarExpanded ? 'obsidian-shell is-sidebar-expanded' : 'obsidian-shell'}>
      <aside className={sidebarExpanded ? 'obsidian-sidebar is-expanded' : 'obsidian-sidebar'}>
        <Link href="/dashboard" className="obsidian-brand" aria-label="Ir para dashboard">
          <Image src={brandLogo} alt="Logo ZYRO" className="obsidian-brand-image" priority />
        </Link>

        <div className="obsidian-rail">
          <button
            className={sidebarExpanded ? 'obsidian-sidebar-toggle is-expanded' : 'obsidian-sidebar-toggle'}
            type="button"
            aria-label={sidebarExpanded ? 'Recolher sidebar' : 'Expandir sidebar'}
            onClick={() => setSidebarExpanded((current) => !current)}
            data-ui-reset="true"
          >
            <ChevronRight size={14} />
          </button>

          <nav className="obsidian-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));

              return (
                <Link
                  key={item.to}
                  href={item.to as Route}
                  className={active ? 'obsidian-nav-item is-active' : 'obsidian-nav-item'}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon size={16} />
                  <span className="obsidian-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button className="obsidian-profile" type="button" aria-label="Perfil" data-ui-reset="true" />
        </div>
      </aside>

      <main className="obsidian-main">
        <AnimatedPage>{children}</AnimatedPage>
      </main>

      <aside className="obsidian-rightbar">
        <div className="obsidian-mini-panel">
          <div className="obsidian-notice-head">
            <div className="obsidian-notice-app">
              <span className="obsidian-notice-dot" style={{ backgroundColor: '#22c55e' }} />
              <span>Sessao</span>
            </div>
            <span className="obsidian-notice-time">Agora</span>
          </div>

          <div className="obsidian-notice-copy">
            <strong>{sessionUser?.name || 'Nao autenticado'}</strong>
            <p>{sessionUser?.email || 'Acesse com um usuario valido.'}</p>
          </div>
        </div>

        <div className="obsidian-inbox">
          <article className="obsidian-notice-card">
            <div className="obsidian-notice-head">
              <div className="obsidian-notice-app">
                <span className="obsidian-notice-dot" style={{ backgroundColor: '#3b82f6' }} />
                <span>Role</span>
              </div>
              <span className="obsidian-notice-time">Sessao</span>
            </div>

            <div className="obsidian-notice-copy">
              <strong>{sessionUser?.role || 'SEM_ROLE'}</strong>
              <p>Perfil carregado a partir da sessao atual.</p>
            </div>
          </article>

          <article className="obsidian-notice-card">
            <div className="obsidian-notice-head">
              <div className="obsidian-notice-app">
                <span className="obsidian-notice-dot" style={{ backgroundColor: '#f59e0b' }} />
                <span>Fluxo real</span>
              </div>
              <span className="obsidian-notice-time">API</span>
            </div>

            <div className="obsidian-notice-copy">
              <strong>Modulos disponiveis</strong>
              <p>Use o menu lateral para navegar pelas areas ja conectadas.</p>
            </div>
          </article>
        </div>

        <section className="obsidian-agents-card">
          <div className="obsidian-agents-head">
            <strong>Atalhos</strong>
            <span>{signOutMessage}</span>
          </div>

          <div className="obsidian-agents-list">
            {quickLinks.map((link) => (
              <article key={link.href} className="obsidian-agent-row">
                <div className="obsidian-agent-avatar">
                  <ChevronRight size={14} />
                </div>

                <div className="obsidian-agent-copy">
                  <strong>
                    <Link href={link.href as Route}>{link.label}</Link>
                  </strong>
                  <p>Acesso rapido ao modulo.</p>
                </div>
              </article>
            ))}

            <article className="obsidian-agent-row">
              <div className="obsidian-agent-avatar">
                <Shield size={14} />
              </div>

              <div className="obsidian-agent-copy">
                <strong>Acesso atual</strong>
                <p>{sessionUser ? 'Sessao valida' : 'Sem sessao local'}</p>
              </div>
            </article>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <button type="button" className="obsidian-overview-cta" onClick={handleSignOut}>
              Sair da sessao
            </button>
          </div>
        </section>
      </aside>
    </div>
  );
}
