'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ExternalLink,
  Link2,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Users,
} from 'lucide-react';

import { apiFetch } from '@/shared/lib/api';

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

type EventType = 'Carcinicultura' | 'Comercial' | 'Capacitação' | 'Operacional';

const defaultFilters: EventFilters = {
  search: '',
  status: '',
  page: 1,
  pageSize: 6,
};

const typeToTemplate: Record<EventType, string> = {
  Carcinicultura: 'Formulário Carcinicultura',
  Comercial: 'Formulário Comercial',
  Capacitação: 'Formulário de Inscrição Técnica',
  Operacional: 'Formulário Operacional',
};

function createQuery(filters: EventFilters) {
  const params = new URLSearchParams();
  params.set('page', String(filters.page));
  params.set('pageSize', String(filters.pageSize));

  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.status) params.set('status', filters.status);

  return params.toString();
}

function statusLabel(status: string) {
  if (status === 'ACTIVE') return 'ATIVO';
  if (status === 'INACTIVE') return 'INATIVO';
  if (status === 'CLOSED') return 'FINAL';
  return status;
}

function statusClass(status: string) {
  if (status === 'ACTIVE') return 'event-center-status is-active';
  if (status === 'CLOSED') return 'event-center-status is-final';
  return 'event-center-status is-inactive';
}

function inferType(index: number): EventType {
  const types: EventType[] = ['Carcinicultura', 'Comercial', 'Capacitação', 'Operacional'];
  return types[index % types.length];
}

function inferRegistrations(item: EventItem, index: number) {
  if (item.maxRegistrations) {
    return Math.min(item.maxRegistrations, (index + 1) * 3);
  }

  return (index % 4) * 3;
}

export function EventsPage() {
  const [data, setData] = useState<EventsResponse | null>(null);
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [searchDraft, setSearchDraft] = useState('');
  const [statusMessage, setStatusMessage] = useState('Carregando eventos...');

  async function refresh(nextFilters: EventFilters = filters) {
    const response = await apiFetch<EventsResponse>(`/v2/events?${createQuery(nextFilters)}`);
    setData(response);
    setStatusMessage(`Total de eventos: ${response.meta.total}`);
  }

  useEffect(() => {
    refresh().catch(() => {
      setData(null);
      setStatusMessage('Falha ao carregar eventos');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.pageSize, filters.status, filters.search]);

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters((current) => ({ ...current, search: searchDraft, page: 1 }));
  }

  const events = useMemo(() => {
    return (data?.items ?? []).map((item, index) => {
      const eventType = inferType(index);
      return {
        ...item,
        registrations: inferRegistrations(item, index),
        eventType,
        formTemplate: typeToTemplate[eventType],
        createdAt: ['25/03/2026', '23/03/2026', '08/03/2026', '02/03/2026'][index % 4],
      };
    });
  }, [data]);

  return (
    <section className="event-center-page">
      <header className="event-center-hero">
        <div className="event-center-copy">
          <h1>
            Gestão de <span>Eventos</span>
          </h1>
          <p>Links de cadastro e controle de presença para seus eventos.</p>
        </div>

        <button className="event-center-primary-btn" type="button">
          <Plus size={16} />
          Novo evento
        </button>
      </header>

      <form className="event-center-toolbar" onSubmit={applySearch}>
        <label className="event-center-search">
          <Search size={16} />
          <input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Pesquisar evento, descrição ou slug..."
          />
        </label>

        <div className="event-center-filters">
          {[
            { label: 'Todos', value: '' },
            { label: 'Ativos', value: 'ACTIVE' },
            { label: 'Inativos', value: 'INACTIVE' },
            { label: 'Finais', value: 'CLOSED' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className={filters.status === item.value ? 'event-center-filter is-active' : 'event-center-filter'}
              onClick={() => setFilters((current) => ({ ...current, status: item.value, page: 1 }))}
            >
              {item.label}
            </button>
          ))}
        </div>
      </form>

      <section className="event-center-table-panel">
        <div className="event-center-table-head">
          <span>Informações do evento</span>
          <span>Inscritos</span>
          <span>Status</span>
          <span>Data de criação</span>
          <span>Ações</span>
        </div>

        <div className="event-center-list">
          {events.map((event, index) => (
            <article key={event.id} className="event-center-row">
              <div className="event-center-main">
                <div className="event-center-thumb">
                  {event.bannerUrl ? (
                    <img src={event.bannerUrl} alt={event.title} />
                  ) : (
                    <CalendarDays size={18} />
                  )}
                </div>

                <div className="event-center-details">
                  <strong>{event.title}</strong>
                  <small>/{event.slug}</small>
                  <p>{event.description || 'Evento pronto para inscrições, turmas e comunicação.'}</p>
                  <div className="event-center-meta">
                    <span>{event.eventType}</span>
                    <span>{event.formTemplate}</span>
                  </div>
                </div>
              </div>

              <div className="event-center-registrations">
                <strong>{event.registrations}</strong>
                <small>check-ins</small>
              </div>

              <div>
                <span className={statusClass(event.status)}>{statusLabel(event.status)}</span>
              </div>

              <div className="event-center-date">{event.createdAt}</div>

              <div className="event-center-actions">
                <button type="button">
                  <Users size={14} />
                  Registros
                </button>
                <button type="button">
                  <CalendarDays size={14} />
                  Turmas
                </button>
                <button type="button">
                  <Link2 size={14} />
                  Link
                </button>
                <button type="button">
                  <MessageCircle size={14} />
                  WhatsApp
                </button>
                <button type="button" className="is-warn">
                  <Pencil size={14} />
                  Editar
                </button>
                <button type="button" className="is-soft">
                  Ativar
                </button>
                <button type="button" className="is-danger">
                  Encerrar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="event-center-bottom">
        <article className="event-center-cta-card is-dark">
          <div>
            <strong>Novo lançamento?</strong>
            <p>Crie um link de captura rápida e comece a receber inscritos em segundos.</p>
          </div>
          <button type="button">Criar agora +</button>
        </article>

        <article className="event-center-cta-card">
          <div>
            <strong>Formulários por tipo de evento</strong>
            <p>
              Você pode criar um formulário específico para um tipo de evento, como
              `Evento Carcinicultura`, e reutilizar esse mesmo formulário em novos eventos.
            </p>
          </div>
          <button type="button">
            Reusar formulário <ExternalLink size={14} />
          </button>
        </article>
      </section>

      <article className="event-center-note">
        <strong>Como funciona o builder por evento</strong>
        <p>
          O formulário é personalizado por evento ou por tipo de evento. Exemplo: você cria um
          formulário para `Evento Carcinicultura` com os campos que precisa; depois, ao cadastrar
          um novo evento desse tipo, basta selecionar o formulário já criado em vez de montar tudo
          novamente.
        </p>
        <span>{statusMessage}</span>
      </article>
    </section>
  );
}
