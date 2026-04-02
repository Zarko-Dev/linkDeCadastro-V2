'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';

type CourseItem = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | string;
  type?: 'PRESENCIAL' | 'ONLINE' | string;
  bannerUrl?: string | null;
  maxEnrollments?: number | null;
  waitlistLimit?: number | null;
  waitlistEnabled?: boolean;
  regionRestrictionEnabled?: boolean;
  allowAllRegions?: boolean;
  defaultRegionLimit?: number | null;
  createdById?: string;
  creator?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

type CoursesResponse = {
  items: CourseItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

type CourseFilters = {
  search: string;
  status: string;
  type: string;
  page: number;
  pageSize: number;
};

const defaultFilters: CourseFilters = {
  search: '',
  status: '',
  type: '',
  page: 1,
  pageSize: 6,
};

function courseBadgeClass(status: string) {
  if (status === 'ACTIVE') return 'badge badge-active';
  if (status === 'ARCHIVED') return 'badge badge-archived';
  if (status === 'INACTIVE') return 'badge badge-inactive';
  return 'badge badge-draft';
}

function createQuery(filters: CourseFilters) {
  const params = new URLSearchParams();
  params.set('page', String(filters.page));
  params.set('pageSize', String(filters.pageSize));

  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.status) params.set('status', filters.status);
  if (filters.type) params.set('type', filters.type);

  return params.toString();
}

export function CoursesPage() {
  const [data, setData] = useState<CoursesResponse | null>(null);
  const [filters, setFilters] = useState<CourseFilters>(defaultFilters);
  const [searchDraft, setSearchDraft] = useState('');
  const [statusMessage, setStatusMessage] = useState('Carregando cursos...');
  const [loading, setLoading] = useState(true);

  async function refresh(nextFilters: CourseFilters = filters) {
    setLoading(true);
    const query = createQuery(nextFilters);
    const response = await apiFetch<CoursesResponse>(`/v2/courses?${query}`);
    setData(response);
    setStatusMessage(`Total: ${response.meta.total}`);
    setLoading(false);
  }

  useEffect(() => {
    refresh().catch(() => {
      setData(null);
      setLoading(false);
      setStatusMessage('Falha ao carregar cursos');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.pageSize, filters.status, filters.type, filters.search]);

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

  const courses = data?.items ?? [];

  return (
    <section className="hero-surface wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.05}>
            <p className="eyebrow">Core</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2>Cursos</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p>
              Catálogo do core com paginação, filtros e leitura dos campos reais da V2. A
              tela agora conversa com `courses`, `creator`, status e tipo sem depender de
              contratos antigos.
            </p>
          </FadeIn>
          <div className="summary-row">
            <div className="pill">{statusMessage}</div>
            <div className="pill pill-ghost">
              Página {data?.meta.page ?? filters.page}/{data?.meta.totalPages ?? 0}
            </div>
            <div className="pill pill-ghost">PostgreSQL</div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <div className="panel panel-accent">
            <strong>Leitura rápida</strong>
            <p>
              O card mostra status, tipo, criador e sinais de capacidade para ajudar a
              operação a decidir com rapidez.
            </p>
          </div>
          <div className="panel">
            <strong>Consumo funcional</strong>
            <p>
              O filtro por status e tipo ajuda a validar o catálogo sem depender do admin
              interno.
            </p>
          </div>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={applySearch} style={{ marginTop: 18 }}>
        <div className="panel-head">
          <strong>Filtros do catálogo</strong>
          <span className="pill pill-ghost">
            {loading ? 'Carregando...' : `${courses.length} itens`}
          </span>
        </div>
        <div className="builder-layout">
          <label className="field-block">
            <span>Busca</span>
            <input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Titulo, slug ou descricao"
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
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </label>
          <label className="field-block">
            <span>Tipo</span>
            <select
              value={filters.type}
              onChange={(event) =>
                setFilters((current) => ({ ...current, type: event.target.value, page: 1 }))
              }
            >
              <option value="">Todos</option>
              <option value="ONLINE">ONLINE</option>
              <option value="PRESENCIAL">PRESENCIAL</option>
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
        {courses.map((course) => (
          <StaggerItem key={course.id}>
            <article className="panel">
              <div className="panel-head">
                <strong>{course.title}</strong>
                <span className={courseBadgeClass(course.status)}>{course.status}</span>
              </div>
              <p>{course.description || 'Sem descrição cadastrada.'}</p>
              <div className="summary-row">
                <span className="pill pill-ghost">{course.slug}</span>
                <span className="pill pill-ghost">{course.type ?? 'ONLINE'}</span>
              </div>
              <div className="summary-row" style={{ marginTop: '0.75rem' }}>
                <span className="pill pill-ghost">
                  {course.creator?.name || 'Criador não informado'}
                </span>
                <span className="pill pill-ghost">
                  {course.maxEnrollments ? `Vagas ${course.maxEnrollments}` : 'Sem limite'}
                </span>
              </div>
              <div className="summary-row" style={{ marginTop: '0.5rem' }}>
                <span className="pill pill-ghost">
                  {course.waitlistEnabled ? 'Fila ativa' : 'Fila desativada'}
                </span>
                <span className="pill pill-ghost">
                  {course.regionRestrictionEnabled ? 'Restrição regional' : 'Regiões livres'}
                </span>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
