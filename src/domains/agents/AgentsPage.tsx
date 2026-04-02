'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';
import { ZyrEmptyState, ZyrErrorState, ZyrHint } from '@/shared/ui/zyr/ZyrStates';

type AgentItem = {
  id: string;
  name: string;
  mode: 'HUMAN' | 'COPILOT' | 'AUTONOMOUS';
  status: 'ACTIVE' | 'PAUSED' | 'OFFLINE';
  domain?: string;
  queue?: string;
  description?: string;
};

type AgentsResponse = {
  items: AgentItem[];
  meta: {
    total: number;
  };
};

type QueueStatusResponse = {
  status: string;
  workers: string[];
  queues: Array<{
    name: string;
    queued: number;
    processing: number;
    completed: number;
    failed: number;
  }>;
};

type AgentDraft = {
  name: string;
  mode: AgentItem['mode'];
  domain: string;
  queue: string;
  description: string;
};

const modeCopy: Record<AgentItem['mode'], string> = {
  HUMAN: 'Operacao humana com baixa automacao.',
  COPILOT: 'Sugere respostas e acelera a triagem.',
  AUTONOMOUS: 'Executa fluxos controlados com autonomia.',
};

const defaultDraft: AgentDraft = {
  name: '',
  mode: 'COPILOT',
  domain: 'support',
  queue: 'chat-main',
  description: '',
};

export function AgentsPage() {
  const [data, setData] = useState<AgentsResponse | null>(null);
  const [queue, setQueue] = useState<QueueStatusResponse | null>(null);
  const [draft, setDraft] = useState<AgentDraft>(defaultDraft);
  const [message, setMessage] = useState('Carregando agentes...');

  async function refresh() {
    const [agents, queueStatus] = await Promise.all([
      apiFetch<AgentsResponse>('/v2/admin/agents'),
      apiFetch<QueueStatusResponse>('/v2/platform/queue/status'),
    ]);

    setData(agents);
    setQueue(queueStatus);
  }

  useEffect(() => {
    refresh()
      .then(() => setMessage('Agentes prontos para operar com core, chat e fila.'))
      .catch((error: any) => setMessage(error?.message || 'Falha ao carregar agentes.'));
  }, []);

  const queueSummary = useMemo(() => {
    if (!queue) return 'Fila indisponivel';

    const activeWorkers = queue.workers.length;
    const totalQueued = queue.queues.reduce((sum, item) => sum + item.queued, 0);
    const totalProcessing = queue.queues.reduce((sum, item) => sum + item.processing, 0);
    const totalFailed = queue.queues.reduce((sum, item) => sum + item.failed, 0);

    return `${queue.status} | ${activeWorkers} workers | ${totalQueued} na fila | ${totalProcessing} processando | ${totalFailed} falhas`;
  }, [queue]);

  function handleCreateDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`Rascunho pronto para ${draft.name || 'novo agente'} em ${draft.domain}.`);
  }

  const totalAgents = data?.meta.total ?? data?.items.length ?? 0;

  return (
    <section className="hero-surface wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.04}>
            <p className="eyebrow">Agentes</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2>Estudio de agentes e modos de operacao</h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p>
              O agente precisa nascer com objetivo, dominio e fila claros. Essa tela funciona
              como um estúdio de decisão, nao como formulario administrativo tradicional.
            </p>
          </FadeIn>

          <div className="summary-row">
            <div className="pill">{totalAgents} agentes</div>
            <div className="pill pill-ghost">Copilot</div>
            <div className="pill pill-ghost">Autonomia guiada</div>
            <div className="pill pill-ghost">{queueSummary}</div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <ZyrHint
            title="Zyr orienta responsabilidade antes de ativar autonomia"
            description="Agente bom nasce com domínio, fila e papel definidos. O fluxo precisa deixar isso evidente antes da primeira execução."
            tips={[
              'separe atendimento de automacao',
              'ligue cada agente a um dominio',
              'ativa autonomia apenas com fluxo definido',
            ]}
          />
          <div className="panel panel-accent">
            <strong>Principio operacional</strong>
            <p>
              Os agentes sao interfaces para acao: ficam entre o core do produto, a fila e a
              inbox do WhatsApp.
            </p>
          </div>
          <div className="panel">
            <strong>Workers ativos</strong>
            <p className="muted">
              {queue?.workers?.length ? queue.workers.join(' | ') : 'Nenhum worker registrado ainda'}
            </p>
          </div>
        </div>
      </div>

      <div className="builder-layout" style={{ marginTop: 18 }}>
        <article className="panel form-card">
          <div className="panel-head">
            <strong>Criar agente</strong>
            <span className="pill pill-ghost">Builder</span>
          </div>
          <form className="stack form-grid" onSubmit={handleCreateDraft}>
            <label className="field-block">
              <span>Nome</span>
              <input
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nome do agente"
              />
            </label>
            <label className="field-block">
              <span>Modo</span>
              <select
                value={draft.mode}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, mode: event.target.value as AgentItem['mode'] }))
                }
              >
                <option value="HUMAN">HUMAN</option>
                <option value="COPILOT">COPILOT</option>
                <option value="AUTONOMOUS">AUTONOMOUS</option>
              </select>
            </label>
            <label className="field-block">
              <span>Dominio</span>
              <input
                value={draft.domain}
                onChange={(event) => setDraft((current) => ({ ...current, domain: event.target.value }))}
                placeholder="Dominio"
              />
            </label>
            <label className="field-block">
              <span>Fila</span>
              <input
                value={draft.queue}
                onChange={(event) => setDraft((current) => ({ ...current, queue: event.target.value }))}
                placeholder="Fila"
              />
            </label>
            <label className="field-block">
              <span>Descrição</span>
              <textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Descricao"
                rows={5}
              />
            </label>
            <button type="submit">Preparar rascunho do agente</button>
          </form>
          <p className="muted" style={{ marginTop: 12 }}>
            {modeCopy[draft.mode]}
          </p>
        </article>

        <div className="stack">
          <article className="panel panel-accent">
            <strong>Leitura da fila</strong>
            <p className="muted">
              O agente ideal precisa nascer com domínio, fila e responsabilidade clara antes de
              receber tráfego real.
            </p>
          </article>

          {message.toLowerCase().includes('falha') ? (
            <ZyrErrorState
              title="Zyr nao conseguiu ler os agentes do workspace"
              description={message}
              action={<button type="button" onClick={() => void refresh()}>Recarregar agentes</button>}
            />
          ) : data?.items?.length ? (
            <StaggerGroup className="agent-grid" delayChildren={0.08} staggerChildren={0.06}>
              {data.items.map((agent) => (
                <StaggerItem key={agent.id}>
                  <article className="panel agent-card">
                    <div className="panel-head">
                      <div>
                        <strong>{agent.name}</strong>
                        <p className="muted" style={{ marginTop: 6 }}>
                          {agent.description || modeCopy[agent.mode]}
                        </p>
                      </div>
                      <span className={`pill agent-status agent-${agent.status.toLowerCase()}`}>
                        {agent.status}
                      </span>
                    </div>

                    <div className="agent-meta">
                      <span className="pill">{agent.mode}</span>
                      <span className="pill">{agent.domain || 'geral'}</span>
                      <span className="pill">{agent.queue || 'sem fila dedicada'}</span>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <ZyrEmptyState
              title="Zyr ainda nao encontrou agentes ativos"
              description="Esse espaco fica muito mais util quando o primeiro agente de atendimento ou automacao entrar em operacao."
              action={
                <button
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, name: 'Novo agente Zyr' }))}
                >
                  Preparar primeiro agente
                </button>
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}
