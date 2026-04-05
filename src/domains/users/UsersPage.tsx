'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BadgeCheck, Shield, UserCog, Users } from 'lucide-react';

import { clearSession, apiFetch, getStoredUser, type SessionUser } from '@/shared/lib/api';

type AuthMeResponse = SessionUser & {
  isActive?: boolean;
};

const roleCards = [
  {
    title: 'SUPER_ADMIN',
    description: 'Cria acessos, define regras e organiza workspaces inteiros.',
    icon: Shield,
  },
  {
    title: 'ADMIN',
    description: 'Opera a gestao da empresa e acompanha o time responsavel.',
    icon: UserCog,
  },
  {
    title: 'USER',
    description: 'Executa tarefas do workspace com permissoes mais controladas.',
    icon: Users,
  },
] as const;

export function UsersPage() {
  const router = useRouter();
  const [data, setData] = useState<AuthMeResponse | null>(null);
  const [status, setStatus] = useState('Carregando seu acesso...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedUser = getStoredUser();
    if (cachedUser) {
      setData((current) => current || cachedUser);
    }
  }, []);

  async function refresh() {
    setLoading(true);

    try {
      const response = await apiFetch<AuthMeResponse>('/v2/auth/me');
      setData(response);
      setStatus(`Acesso carregado para ${response.name}.`);
    } catch (error: any) {
      const cachedUser = getStoredUser();
      if (cachedUser) {
        setData(cachedUser);
        setStatus('Sessao local encontrada, mas nao foi possivel validar com a API.');
      } else {
        setData(null);
        setStatus(error?.message || 'Nao foi possivel carregar seu acesso.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleLogout() {
    try {
      await apiFetch('/v2/auth/logout', { method: 'POST' });
    } catch {
      // Logout deve funcionar mesmo sem resposta da API.
    } finally {
      clearSession();
      router.replace('/login');
    }
  }

  const user = data;
  const initials = (user?.name || user?.email || 'U').slice(0, 1).toUpperCase();

  return (
    <section className="obsidian-users-page">
      <section className="obsidian-users-hero">
        <div className="obsidian-users-copy">
          <span className="obsidian-users-kicker">Auth</span>
          <h1>Seu acesso autenticado no mesmo painel operacional.</h1>
          <p>
            O backend exposto hoje entrega o usuario autenticado, entao esta tela mostra o acesso
            real em vez de inventar uma lista de pessoas.
          </p>
        </div>

        <div className="obsidian-users-statuses">
          <span className="obsidian-users-status">{loading ? 'Carregando...' : status}</span>
          <span className="obsidian-users-status is-accent">
            {user?.role || 'SEM_ROLE'} • {user?.isActive === false ? 'Inativo' : 'Ativo'}
          </span>
        </div>
      </section>

      <section className="obsidian-users-metrics">
        <article className="obsidian-users-metric-card">
          <span>Usuario autenticado</span>
          <strong>{user?.name || 'Nao autenticado'}</strong>
          <small>{user?.email || 'Acesse a tela de login para entrar'}</small>
        </article>
        <article className="obsidian-users-metric-card">
          <span>Perfil</span>
          <strong>{user?.role || 'SEM_ROLE'}</strong>
          <small>Regra vinda do token e da API</small>
        </article>
        <article className="obsidian-users-metric-card">
          <span>Sessao</span>
          <strong>{user ? 'Ativa' : 'Ausente'}</strong>
          <small>Refresh via cookie HttpOnly</small>
        </article>
      </section>

      <section className="obsidian-users-role-cards">
        {roleCards.map((role) => {
          const Icon = role.icon;
          return (
            <article key={role.title} className="obsidian-users-role-card">
              <div className="obsidian-users-role-head">
                <div className="obsidian-users-role-icon">
                  <Icon size={18} />
                </div>
                <span>{role.title}</span>
              </div>
              <p>{role.description}</p>
            </article>
          );
        })}
      </section>

      <section className="obsidian-users-workspace">
        <article className="obsidian-users-panel obsidian-users-create">
          <div className="obsidian-users-panel-head">
            <strong>Detalhes da sessao</strong>
            <small>Esta tela agora reflete o usuario autenticado em tempo real.</small>
          </div>

          <div className="obsidian-users-form-grid is-tight">
            <div className="obsidian-users-field">
              <span>Nome</span>
              <div className="obsidian-users-usercell">
                <div className="obsidian-users-avatar">{initials}</div>
                <div>
                  <strong>{user?.name || 'Nao autenticado'}</strong>
                  <small>{user?.email || 'Sem usuario em sessao'}</small>
                </div>
              </div>
            </div>

            <div className="obsidian-users-field">
              <span>Role</span>
              <input value={user?.role || ''} readOnly placeholder="Role" />
            </div>

            <div className="obsidian-users-field">
              <span>Status</span>
              <input value={user?.isActive === false ? 'Inativo' : 'Ativo'} readOnly />
            </div>

            <div className="obsidian-users-field">
              <span>Origem</span>
              <input value="v2/auth/me" readOnly />
            </div>
          </div>

          <div className="obsidian-users-actions">
            <button className="obsidian-users-primary-btn" type="button" onClick={refresh}>
              Atualizar sessao
            </button>
            <button className="obsidian-users-secondary-btn" type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </article>

        <article className="obsidian-users-panel obsidian-users-filters">
          <div className="obsidian-users-panel-head">
            <strong>Proxima etapa do produto</strong>
            <small>Os endpoints de listagem e CRUD para usuarios podem ser adicionados depois.</small>
          </div>

          <div className="obsidian-users-form-grid">
            <div className="obsidian-users-field">
              <span>Login</span>
              <Link className="obsidian-users-primary-btn" href="/login">
                Abrir tela de login
              </Link>
            </div>
            <div className="obsidian-users-field">
              <span>Conexao</span>
              <input value="Somente leitura no estado atual" readOnly />
            </div>
            <div className="obsidian-users-field">
              <span>Checklist</span>
              <input value="Auth real, sem mock de lista" readOnly />
            </div>
          </div>
        </article>
      </section>

      <section className="obsidian-users-table-panel">
        <div className="obsidian-users-panel-head">
          <strong>Validaacao de acesso</strong>
          <small>Se a API devolver erro, a tela mostra o problema real em vez de inventar dados.</small>
        </div>

        <div className="obsidian-users-table-wrap">
          <div className="obsidian-users-empty">
            <BadgeCheck size={18} />
            <span>
              {user
                ? 'Acesso autenticado e pronto para operar.'
                : 'Nenhuma sessao carregada no momento.'}
            </span>
          </div>
        </div>
      </section>
    </section>
  );
}
