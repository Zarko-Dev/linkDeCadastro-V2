'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';

type EventItem = {
  id: string;
  title: string;
  slug: string;
  linkId: string;
  description?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED' | string;
  maxRegistrations?: number | null;
  bannerUrl?: string | null;
  creator?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

type EventsResponse = {
  items: EventItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

type EventFilters = {
  search: string;
  status: string;
  page: number;
  pageSize: number;
};

const defaultFilters: EventFilters = {
  search: '',
  status: '',
  page: 1,
  pageSize: 6,
};

function eventBadgeClass(status: string) {
  if (status === 'ACTIVE') return 'badge badge-active';
  if (status === 'CLOSED') return 'badge badge-inactive';
  if (status === 'INACTIVE') return 'badge badge-draft';
  return 'badge badge-draft';
}

function createQuery(filters: EventFilters) {
  const params = new URLSearchParams();
  params.set('page', String(filters.page));
  params.set('pageSize', String(filters.pageSize));

  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.status) params.set('status', filters.status);

  return params.toString();
}

export function EventsPage() {
  const [data, setData] = useState<EventsResponse | null>(null);
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [searchDraft, setSearchDraft] = useState('');
  const [statusMessage, setStatusMessage] = useState('Carregando eventos...');
  const [loading, setLoading] = useState(true);

  async function refresh(nextFilters: EventFilters = filters) {
    setLoading(true);
    const query = createQuery(nextFilters);
    const response = await apiFetch<EventsResponse>(`/v2/events?${query}`);
    setData(response);
    setStatusMessage(`Total: ${response.meta.total}`);
    setLoading(false);
  }

  useEffect(() => {
    refresh().catch(() => {
      setData(null);
      setLoading(false);
      setStatusMessage('Falha ao carregar eventos');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.pageSize, filters.status, filters.search]);

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters((current) => ({ ...current, search: searchDraft, page: 1 }));
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

  const events = data?.items ?? [];

  return (
    <section className="hero-surface wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.05}>
            <p className="eyebrow">Core</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2>Eventos</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p>
              Leitura pública do core com eventos, status, limite e criador. A tela já reflete
              o contrato da V2 e permite filtrar o catálogo por busca e estado.
            </p>
          </FadeIn>
          <div className="summary-row">
            <div className="pill">{statusMessage}</div>
            <div className="pill pill-ghost">
              Página {data?.meta.page ?? filters.page}/{data?.meta.totalPages ?? 0}
            </div>
            <div className="pill pill-ghost">Inscrições</div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <div className="panel panel-accent">
            <strong>Controle visual</strong>
            <p>
              O preview precisa mostrar a leitura editorial do evento sem esconder o estado
              operacional.
            </p>
          </div>
          <div className="panel">
            <strong>Contrato real</strong>
            <p>
              O backend entrega `linkId`, `creator` e `maxRegistrations`, então a página
              espelha esses campos diretamente.
            </p>
          </div>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={applySearch} style={{ marginTop: 18 }}>
        <div className="panel-head">
          <strong>Filtros dos eventos</strong>
          <span className="pill pill-ghost">
            {loading ? 'Carregando...' : `${events.length} itens`}
          </span>
        </div>
        <div className="builder-layout">
          <label className="field-block">
            <span>Busca</span>
            <input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Titulo, slug, linkId ou descricao"
            />
          </label>
          <label className="field-block">
            <span>Status</span>
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))
              }
            >
              <option value="">Todos</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="CLOSED">CLOSED</option>
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
              <option value={6}>6</option>
              <option value={12}>12</option>
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

      <StaggerGroup className="feature-grid" delayChildren={0.12} staggerChildren={0.08}>
        {events.map((event) => (
          <StaggerItem key={event.id}>
            <article className="panel panel-accent">
              <div className="panel-head">
                <strong>{event.title}</strong>
                <span className={eventBadgeClass(event.status)}>{event.status}</span>
              </div>
              <p>{event.description || 'Sem descrição cadastrada.'}</p>
              <div className="summary-row">
                <span className="pill pill-ghost">{event.slug}</span>
                <span className="pill pill-ghost">{event.linkId}</span>
              </div>
              <div className="summary-row" style={{ marginTop: '0.75rem' }}>
                <span className="pill pill-ghost">
                  {event.creator?.name || 'Criador não informado'}
                </span>
                <span className="pill pill-ghost">
                  {event.maxRegistrations ? `Vagas ${event.maxRegistrations}` : 'Sem limite'}
                </span>
              </div>
              {event.bannerUrl ? (
                <div className="summary-row" style={{ marginTop: '0.5rem' }}>
                  <span className="pill pill-ghost">Banner vinculado</span>
                </div>
              ) : null}
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
