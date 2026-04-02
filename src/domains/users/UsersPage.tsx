'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';

type UserItem = {
  id: string;
  email: string;
  name: string;
  fullName?: string | null;
  phone?: string | null;
  cpf?: string | null;
  state?: string | null;
  city?: string | null;
  role: string;
  participantType?: string | null;
  avatar?: string | null;
  bio?: string | null;
  isActive?: boolean;
};

type UsersResponse = {
  items: UserItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

type UserFilters = {
  search: string;
  role: string;
  participantType: string;
  state: string;
  city: string;
  isActive: string;
  page: number;
  pageSize: number;
};

type UserForm = {
  email: string;
  name: string;
  fullName: string;
  role: string;
  password: string;
  phone: string;
  cpf: string;
  state: string;
  city: string;
  participantType: string;
  isActive: boolean;
};

const defaultFilters: UserFilters = {
  search: '',
  role: '',
  participantType: '',
  state: '',
  city: '',
  isActive: '',
  page: 1,
  pageSize: 8,
};

const emptyForm: UserForm = {
  email: '',
  name: '',
  fullName: '',
  role: 'USER',
  password: '',
  phone: '',
  cpf: '',
  state: '',
  city: '',
  participantType: 'PRODUTOR',
  isActive: true,
};

function roleBadgeClass(role: string) {
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return 'badge badge-active';
  return 'badge badge-draft';
}

function activeBadgeClass(isActive?: boolean) {
  return isActive === false ? 'badge badge-inactive' : 'badge badge-active';
}

function createQuery(filters: UserFilters) {
  const params = new URLSearchParams();
  params.set('page', String(filters.page));
  params.set('pageSize', String(filters.pageSize));

  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.role) params.set('role', filters.role);
  if (filters.participantType) params.set('participantType', filters.participantType);
  if (filters.state) params.set('state', filters.state);
  if (filters.city) params.set('city', filters.city);
  if (filters.isActive) params.set('isActive', filters.isActive);

  return params.toString();
}

export function UsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const [searchDraft, setSearchDraft] = useState('');
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Carregando...');
  const [loading, setLoading] = useState(true);

  async function refresh(nextFilters: UserFilters = filters) {
    setLoading(true);
    const response = await apiFetch<UsersResponse>(`/v2/users?${createQuery(nextFilters)}`);
    setData(response);
    setStatus(`Total: ${response.meta.total}`);
    setLoading(false);
  }

  useEffect(() => {
    refresh().catch(() => {
      setData(null);
      setLoading(false);
      setStatus('Falha ao carregar usuarios');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.pageSize, filters.search, filters.role, filters.participantType, filters.state, filters.city, filters.isActive]);

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters((current) => ({ ...current, search: searchDraft, page: 1 }));
  }

  function startEdit(user: UserItem) {
    setEditingId(user.id);
    setForm({
      email: user.email,
      name: user.name,
      fullName: user.fullName || '',
      role: user.role,
      password: '',
      phone: user.phone || '',
      cpf: user.cpf || '',
      state: user.state || '',
      city: user.city || '',
      participantType: user.participantType || 'PRODUTOR',
      isActive: user.isActive ?? true,
    });
  }

  async function removeUser(id: string) {
    setStatus('Removendo usuario...');
    try {
      await apiFetch(`/v2/users/${id}`, { method: 'DELETE' });
      await refresh();
      setStatus('Usuario removido');
    } catch {
      setStatus('Falha ao remover usuario');
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentId = editingId;
    setStatus(currentId ? 'Atualizando usuario...' : 'Salvando usuario...');

    try {
      await apiFetch(currentId ? `/v2/users/${currentId}` : '/v2/users', {
        method: currentId ? 'PATCH' : 'POST',
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          fullName: form.fullName || undefined,
          role: form.role,
          password: form.password || undefined,
          phone: form.phone || undefined,
          cpf: form.cpf || undefined,
          state: form.state || undefined,
          city: form.city || undefined,
          participantType: form.participantType || undefined,
          isActive: form.isActive,
        }),
      });

      setForm(emptyForm);
      setEditingId(null);
      await refresh();
      setStatus(currentId ? 'Usuario atualizado com sucesso' : 'Usuario criado com sucesso');
    } catch {
      setStatus('Falha ao salvar usuario');
    }
  }

  function nextPage() {
    setFilters((current) => ({
      ...current,
      page: Math.min(current.page + 1, data?.meta.totalPages || current.page + 1),
    }));
  }

  function previousPage() {
    setFilters((current) => ({ ...current, page: Math.max(1, current.page - 1) }));
  }

  const users = data?.items ?? [];

  return (
    <section className="hero-surface wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.05}>
            <p className="eyebrow">Core</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2>Usuarios</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p>
              A página de usuários agora respeita o contrato expandido do core: perfil,
              localização, tipo de participante, status e paginação.
            </p>
          </FadeIn>
          <div className="summary-row">
            <div className="pill">{status}</div>
            <div className="pill pill-ghost">
              Página {data?.meta.page ?? filters.page}/{data?.meta.totalPages ?? 0}
            </div>
            <div className="pill pill-ghost">PostgreSQL</div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <div className="panel panel-accent">
            <strong>Leitura completa</strong>
            <p>
              A tela mostra os principais campos do usuário para não esconder os dados que o
              core realmente persiste.
            </p>
          </div>
          <div className="panel">
            <strong>Fluxo funcional</strong>
            <p>
              Criação, edição e exclusão continuam no mesmo fluxo, mas agora com contexto de
              busca e paginação.
            </p>
          </div>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={applySearch} style={{ marginTop: 18 }}>
        <div className="panel-head">
          <strong>Filtros de usuários</strong>
          <span className="pill pill-ghost">
            {loading ? 'Carregando...' : `${users.length} itens`}
          </span>
        </div>
        <div className="builder-layout">
          <label className="field-block">
            <span>Busca</span>
            <input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Nome, email, CPF ou telefone"
            />
          </label>
          <label className="field-block">
            <span>Papel</span>
            <select
              value={filters.role}
              onChange={(event) =>
                setFilters((current) => ({ ...current, role: event.target.value, page: 1 }))
              }
            >
              <option value="">Todos</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </label>
          <label className="field-block">
            <span>Tipo de participante</span>
            <select
              value={filters.participantType}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  participantType: event.target.value,
                  page: 1,
                }))
              }
            >
              <option value="">Todos</option>
              <option value="ESTUDANTE">ESTUDANTE</option>
              <option value="PROFESSOR">PROFESSOR</option>
              <option value="PESQUISADOR">PESQUISADOR</option>
              <option value="PRODUTOR">PRODUTOR</option>
            </select>
          </label>
          <label className="field-block">
            <span>Estado</span>
            <input
              value={filters.state}
              onChange={(event) =>
                setFilters((current) => ({ ...current, state: event.target.value.toUpperCase(), page: 1 }))
              }
              placeholder="SP"
            />
          </label>
          <label className="field-block">
            <span>Cidade</span>
            <input
              value={filters.city}
              onChange={(event) =>
                setFilters((current) => ({ ...current, city: event.target.value, page: 1 }))
              }
              placeholder="São Paulo"
            />
          </label>
          <label className="field-block">
            <span>Status</span>
            <select
              value={filters.isActive}
              onChange={(event) =>
                setFilters((current) => ({ ...current, isActive: event.target.value, page: 1 }))
              }
            >
              <option value="">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </label>
          <label className="field-block">
            <span>Itens por página</span>
            <select
              value={filters.pageSize}
              onChange={(event) =>
                setFilters((current) => ({ ...current, pageSize: Number(event.target.value), page: 1 }))
              }
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
            </select>
          </label>
          <div className="summary-row" style={{ alignSelf: 'end' }}>
            <button type="submit">Aplicar busca</button>
            <button
              type="button"
              onClick={() => {
                setSearchDraft('');
                setFilters(defaultFilters);
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      </form>

      <div className="summary-row" style={{ marginTop: 12 }}>
        <button type="button" onClick={previousPage} disabled={filters.page <= 1}>
          Página anterior
        </button>
        <div className="pill pill-ghost">
          Página {data?.meta.page ?? filters.page} de {data?.meta.totalPages ?? 0}
        </div>
        <button
          type="button"
          onClick={nextPage}
          disabled={Boolean(data && filters.page >= data.meta.totalPages)}
        >
          Próxima página
        </button>
      </div>

      <div className="builder-layout" style={{ marginTop: 18 }}>
        <form className="panel form-grid" onSubmit={handleSubmit}>
          <div className="panel-head">
            <strong>{editingId ? 'Editar usuario' : 'Novo usuario'}</strong>
            <span className="pill pill-ghost">Entrada rápida</span>
          </div>
          <label className="field-block">
            <span>Nome</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Nome"
            />
          </label>
          <label className="field-block">
            <span>Nome completo</span>
            <input
              value={form.fullName}
              onChange={(event) =>
                setForm((current) => ({ ...current, fullName: event.target.value }))
              }
              placeholder="Nome completo"
            />
          </label>
          <label className="field-block">
            <span>Email</span>
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email"
            />
          </label>
          <label className="field-block">
            <span>Papel</span>
            <select
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </label>
          <label className="field-block">
            <span>Tipo de participante</span>
            <select
              value={form.participantType}
              onChange={(event) =>
                setForm((current) => ({ ...current, participantType: event.target.value }))
              }
            >
              <option value="ESTUDANTE">ESTUDANTE</option>
              <option value="PROFESSOR">PROFESSOR</option>
              <option value="PESQUISADOR">PESQUISADOR</option>
              <option value="PRODUTOR">PRODUTOR</option>
            </select>
          </label>
          <label className="field-block">
            <span>Telefone</span>
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Telefone"
            />
          </label>
          <label className="field-block">
            <span>CPF</span>
            <input
              value={form.cpf}
              onChange={(event) => setForm((current) => ({ ...current, cpf: event.target.value }))}
              placeholder="CPF"
            />
          </label>
          <label className="field-block">
            <span>Estado</span>
            <input
              value={form.state}
              onChange={(event) =>
                setForm((current) => ({ ...current, state: event.target.value.toUpperCase() }))
              }
              placeholder="SP"
            />
          </label>
          <label className="field-block">
            <span>Cidade</span>
            <input
              value={form.city}
              onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
              placeholder="São Paulo"
            />
          </label>
          <label className="field-block">
            <span>Senha temporária</span>
            <input
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Senha temporária"
              type="password"
            />
          </label>
          <label className="field-block">
            <span>Ativo</span>
            <select
              value={form.isActive ? 'true' : 'false'}
              onChange={(event) =>
                setForm((current) => ({ ...current, isActive: event.target.value === 'true' }))
              }
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </label>
          <button type="submit">{editingId ? 'Salvar alterações' : 'Criar usuário'}</button>
        </form>

        <div className="workspace-side-stack">
          <div className="panel panel-accent">
            <strong>Inventário do core</strong>
            <p>
              Os cartões exibem papel, tipo de participante, localidade e estado ativo sem
              esconder os dados operacionais.
            </p>
          </div>
          <StaggerGroup className="agent-grid" delayChildren={0.12} staggerChildren={0.08}>
            {users.map((user) => (
              <StaggerItem key={user.id}>
                <article className="panel">
                  <div className="panel-head">
                    <strong>{user.name}</strong>
                    <span className={roleBadgeClass(user.role)}>{user.role}</span>
                  </div>
                  <p>{user.email}</p>
                  <div className="summary-row">
                    <span className={activeBadgeClass(user.isActive)}>
                      {user.isActive === false ? 'INATIVO' : 'ATIVO'}
                    </span>
                    <span className="pill pill-ghost">
                      {user.participantType || 'Sem tipo informado'}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="pill pill-ghost">{user.fullName || user.name}</span>
                    <span className="pill pill-ghost">
                      {user.state && user.city
                        ? `${user.state} • ${user.city}`
                        : 'Localização não informada'}
                    </span>
                  </div>
                  <div className="summary-row" style={{ marginTop: '0.75rem' }}>
                    <button type="button" onClick={() => startEdit(user)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => removeUser(user.id)}>
                      Excluir
                    </button>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
