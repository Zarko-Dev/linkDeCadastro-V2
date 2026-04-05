'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch, ApiFetchError } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';

type EventItem = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: string;
  maxRegistrations?: number | null;
};

type EventsResponse = {
  items: EventItem[];
  meta: { total: number };
};

type EventForm = {
  title: string;
  slug: string;
  description: string;
  status: string;
  maxRegistrations: string;
};

const emptyForm: EventForm = {
  title: '',
  slug: '',
  description: '',
  status: 'DRAFT',
  maxRegistrations: '',
};

function eventBadgeClass(status: string) {
  if (status === 'ACTIVE') {
    return 'badge badge-active';
  }

  if (status === 'CLOSED') {
    return 'badge badge-inactive';
  }

  return 'badge badge-draft';
}

export function EventsAdminPage() {
  const [data, setData] = useState<EventsResponse | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('Carregando eventos...');
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    try {
      const response = await apiFetch<EventsResponse>('/v2/events');
      setData(response);
      setMessage(`Total: ${response.meta.total}`);
    } catch (error) {
      setMessage(error instanceof ApiFetchError ? error.message : 'Falha ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function validateForm() {
    if (!form.title.trim()) {
      setMessage('Informe o titulo do evento.');
      return false;
    }

    if (!form.slug.trim()) {
      setMessage('Informe o slug do evento.');
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const currentId = editingId;
    setMessage(currentId ? 'Atualizando evento...' : 'Criando evento...');

    try {
      await apiFetch(currentId ? `/v2/events/${currentId}` : '/v2/events', {
        method: currentId ? 'PATCH' : 'POST',
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || undefined,
          status: form.status,
          maxRegistrations: form.maxRegistrations ? Number(form.maxRegistrations) : null,
        }),
      });

      setForm(emptyForm);
      setEditingId(null);
      await refresh();
      setMessage(currentId ? 'Evento atualizado' : 'Evento criado');
    } catch (error) {
      setMessage(error instanceof ApiFetchError ? error.message : 'Falha ao salvar evento');
    }
  }

  function startEdit(item: EventItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description || '',
      status: item.status,
      maxRegistrations:
        item.maxRegistrations === null || item.maxRegistrations === undefined
          ? ''
          : String(item.maxRegistrations),
    });
  }

  async function removeEvent(id: string) {
    setMessage('Removendo evento...');
    try {
      await apiFetch(`/v2/events/${id}`, { method: 'DELETE' });
      await refresh();
      setMessage('Evento removido');
    } catch (error) {
      setMessage(error instanceof ApiFetchError ? error.message : 'Falha ao remover evento');
    }
  }

  const events = data?.items ?? [];
  const previewState = useMemo(
    () => ({
      title: form.title || 'Novo evento',
      slug: form.slug || 'slug-do-evento',
      description: form.description || 'A descricao vai aparecer aqui como preview lateral.',
      status: form.status,
      maxRegistrations: form.maxRegistrations || 'sem limite definido',
    }),
    [form.description, form.maxRegistrations, form.slug, form.status, form.title],
  );

  return (
    <section className="hero-surface wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.05}>
            <p className="eyebrow">Admin</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2>Eventos</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p>
              O evento deve parecer uma sala de controle: estado, vagas e formulacao no mesmo
              campo visual.
            </p>
          </FadeIn>
          <div className="summary-row" style={{ marginTop: 16 }}>
            <div className="pill">{message}</div>
            <div className="pill pill-ghost">{loading ? 'Sincronizando...' : 'Inscricoes'}</div>
            <div className="pill pill-ghost">Publicacao real</div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <article className="panel panel-accent admin-preview-panel sticky-panel">
            <div className="panel-head">
              <strong>Preview lateral</strong>
              <span className={eventBadgeClass(previewState.status)}>{previewState.status}</span>
            </div>
            <div className="admin-preview-grid">
              <div className="admin-preview-item">
                <strong>{previewState.title}</strong>
                <small>{previewState.slug}</small>
              </div>
              <div className="admin-preview-item">
                <strong>Resumo editorial</strong>
                <small>{previewState.description}</small>
              </div>
              <div className="admin-preview-item">
                <strong>Capacidade</strong>
                <small>{previewState.maxRegistrations}</small>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="builder-layout" style={{ marginTop: '18px' }}>
        <form className="panel form-grid" onSubmit={handleSubmit}>
          <div className="panel-head">
            <strong>{editingId ? 'Editar evento' : 'Novo evento'}</strong>
            <span className="pill pill-ghost">Inscricoes</span>
          </div>
          <StaggerGroup className="stack" delayChildren={0.05} staggerChildren={0.06}>
            <StaggerItem>
              <label className="field-block">
                <span>Titulo</span>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Titulo"
                  required
                />
              </label>
            </StaggerItem>
            <StaggerItem>
              <label className="field-block">
                <span>Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, slug: event.target.value }))
                  }
                  placeholder="Slug"
                  required
                />
              </label>
            </StaggerItem>
            <StaggerItem>
              <label className="field-block">
                <span>Descricao</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Descricao"
                  rows={5}
                />
              </label>
            </StaggerItem>
            <StaggerItem>
              <label className="field-block">
                <span>Limite de inscricoes</span>
                <input
                  value={form.maxRegistrations}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, maxRegistrations: event.target.value }))
                  }
                  placeholder="Limite de inscricoes"
                  inputMode="numeric"
                />
              </label>
            </StaggerItem>
            <StaggerItem>
              <label className="field-block">
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, status: event.target.value }))
                  }
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </label>
            </StaggerItem>
          </StaggerGroup>

          <div className="sticky-action-bar">
            <div className="summary-row">
              <span className="pill pill-ghost">{editingId ? 'Modo edicao' : 'Novo registro'}</span>
              <span className="pill pill-ghost">{events.length} itens</span>
            </div>
            <button type="submit" disabled={loading}>
              {editingId ? 'Salvar alteracoes' : 'Criar evento'}
            </button>
          </div>
        </form>

        <div className="workspace-side-stack">
          <div className="panel panel-accent">
            <strong>Lista operacional</strong>
            <p>
              A lista de eventos deve mostrar limite, status e a leitura imediata do card.
            </p>
          </div>
          <StaggerGroup className="agent-grid" delayChildren={0.12} staggerChildren={0.08}>
            {events.map((eventItem) => (
              <StaggerItem key={eventItem.id}>
                <article className="panel interactive-card">
                  <div className="panel-head">
                    <strong>{eventItem.title}</strong>
                    <span className={eventBadgeClass(eventItem.status)}>{eventItem.status}</span>
                  </div>
                  <p>{eventItem.description}</p>
                  <div className="summary-row">
                    <span className="pill pill-ghost">{eventItem.slug}</span>
                    {eventItem.maxRegistrations !== null &&
                    eventItem.maxRegistrations !== undefined ? (
                      <span className="pill pill-ghost">Limite {eventItem.maxRegistrations}</span>
                    ) : null}
                  </div>
                  <div className="summary-row" style={{ marginTop: '0.75rem' }}>
                    <button type="button" onClick={() => startEdit(eventItem)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => removeEvent(eventItem.id)}>
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
