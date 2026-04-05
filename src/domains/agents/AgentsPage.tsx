'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Bot,
  ChevronDown,
  KeyRound,
  Pencil,
  Settings2,
  Shield,
  Trash2,
  UserRoundCog,
} from 'lucide-react';

import { apiFetch } from '@/shared/lib/api';

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

type AgentForm = {
  name: string;
  shortDescription: string;
  module: string;
  slug: string;
  model: string;
  linkedNumber: string;
  defaultMode: AgentItem['mode'];
  instructions: string;
  knowledgeBase: string;
};

const emptyForm: AgentForm = {
  name: '',
  shortDescription: '',
  module: 'Atendimento',
  slug: '',
  model: 'openai/gpt-oss-20b',
  linkedNumber: 'Sem numero fixo',
  defaultMode: 'COPILOT',
  instructions: '',
  knowledgeBase: '',
};

const moduleOptions = ['Atendimento', 'Comercial', 'Suporte', 'Operacional'] as const;
const modelOptions = ['openai/gpt-oss-20b', 'openai/gpt-4.1-mini', 'nvidia/nim-embed'] as const;
const linkedNumberOptions = ['Sem numero fixo', 'WhatsApp principal', 'Linha comercial'] as const;

function formatMode(mode: AgentItem['mode']) {
  if (mode === 'AUTONOMOUS') return 'AUTONOMOUS';
  if (mode === 'COPILOT') return 'COPILOT';
  return 'HUMAN';
}

function deriveSkills(agent: AgentItem) {
  const skills = new Set<string>();

  if (agent.domain) {
    skills.add(`domain:${agent.domain}`);
  }

  if (agent.queue) {
    skills.add(`queue:${agent.queue}`);
  }

  skills.add(`mode:${agent.mode.toLowerCase()}`);
  skills.add(`status:${agent.status.toLowerCase()}`);

  if (agent.domain === 'chat') {
    skills.add('conversation.history');
    skills.add('human.handoff');
    skills.add('message.dispatch');
  }

  if (agent.domain === 'core') {
    skills.add('users.manage');
    skills.add('courses.manage');
    skills.add('events.manage');
  }

  if (agent.mode === 'AUTONOMOUS') {
    skills.add('workflow.execute');
  }

  return Array.from(skills);
}

export function AgentsPage() {
  const [data, setData] = useState<AgentsResponse | null>(null);
  const [queue, setQueue] = useState<QueueStatusResponse | null>(null);
  const [form, setForm] = useState<AgentForm>(emptyForm);
  const [message, setMessage] = useState('Carregando agentes...');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    const [agentsResult, queueResult] = await Promise.allSettled([
      apiFetch<AgentsResponse>('/v2/admin/agents'),
      apiFetch<QueueStatusResponse>('/v2/platform/queue/status'),
    ]);

    if (agentsResult.status === 'fulfilled') {
      setData(agentsResult.value);
    }

    if (queueResult.status === 'fulfilled') {
      setQueue(queueResult.value);
    }

    if (agentsResult.status === 'rejected' && queueResult.status === 'rejected') {
      setLoading(false);
      throw agentsResult.reason;
    }

    setLoading(false);
  }

  useEffect(() => {
    refresh()
      .then(() => setMessage('Central de agentes pronta para configuracao.'))
      .catch((error: { message?: string }) =>
        setMessage(error?.message || 'Falha ao carregar agentes.'),
      );
  }, []);

  const availableAgents = useMemo(() => {
    const items = data?.items ?? [];

    return items.map((agent, index) => {
      const moduleName = moduleOptions[index % moduleOptions.length];

      return {
        ...agent,
        moduleName,
        slug: `agente-${agent.name.toLowerCase().replace(/\s+/g, '-')}`,
        model: index % 2 === 0 ? 'openai/gpt-oss-20b' : 'openai/gpt-4.1-mini',
        linkedNumber: index % 2 === 0 ? 'Sem vinculo fixo' : 'Linha principal',
        ownKey: agent.domain === 'core' ? 'Nao' : 'Sim',
        skills: deriveSkills(agent),
      };
    });
  }, [data]);

  const queueSummary = queue
    ? `${queue.status} • ${queue.workers.length} workers ativos`
    : 'Modulo indisponivel';

  const hasLoadingError = !loading && !data && !queue;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`Agente ${form.name || 'novo'} preparado para revisao.`);
  }

  return (
    <section className="agent-center-page">
      <header className="agent-center-hero">
        <div className="agent-center-copy">
          <div className="agent-center-title-row">
            <Settings2 size={24} />
            <h1>Agentes</h1>
          </div>
          <p>
            Central de agentes do atendimento. O SUPER_ADMIN cria e libera quem pode usar esse
            modulo.
          </p>
        </div>

        <span className="agent-center-badge">Modo Master</span>
      </header>

      <section className="agent-center-top-grid">
        <form className="agent-center-panel agent-center-builder" onSubmit={handleSubmit}>
          <div className="agent-center-panel-head">
            <strong>Criar agente</strong>
          </div>

          <div className="agent-center-form-grid single">
            <label className="agent-center-field">
              <span>Nome do agente</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Ex: Agente Comercial"
              />
            </label>

            <label className="agent-center-field">
              <span>Descricao curta</span>
              <input
                value={form.shortDescription}
                onChange={(event) =>
                  setForm((current) => ({ ...current, shortDescription: event.target.value }))
                }
                placeholder="Resumo rapido da funcao do agente"
              />
            </label>
          </div>

          <div className="agent-center-form-grid">
            <label className="agent-center-field">
              <span>Modulo</span>
              <select
                value={form.module}
                onChange={(event) => setForm((current) => ({ ...current, module: event.target.value }))}
              >
                {moduleOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="agent-center-field">
              <span>Slug interno</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                placeholder="Opcional. Ex: agente-comercial"
              />
            </label>
          </div>

          <div className="agent-center-form-grid single">
            <label className="agent-center-field">
              <span>Modelo do agente</span>
              <select
                value={form.model}
                onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
              >
                {modelOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <small>
                Use `openai/gpt-oss-20b` como padrao mais economico. O modelo da NVIDIA fica melhor
                para embeddings e busca semantica.
              </small>
            </label>
          </div>

          <div className="agent-center-form-grid">
            <label className="agent-center-field">
              <span>Numero vinculado</span>
              <select
                value={form.linkedNumber}
                onChange={(event) =>
                  setForm((current) => ({ ...current, linkedNumber: event.target.value }))
                }
              >
                {linkedNumberOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="agent-center-field">
              <span>Modo padrao do agente</span>
              <select
                value={form.defaultMode}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    defaultMode: event.target.value as AgentItem['mode'],
                  }))
                }
              >
                <option value="COPILOT">COPILOT</option>
                <option value="AUTONOMOUS">AUTONOMOUS</option>
                <option value="HUMAN">HUMAN</option>
              </select>
              <small>Use AUTONOMOUS apenas quando o agente puder agir sozinho com seguranca.</small>
            </label>
          </div>

          <label className="agent-center-field">
            <span>Instrucoes do agente</span>
            <textarea
              value={form.instructions}
              onChange={(event) =>
                setForm((current) => ({ ...current, instructions: event.target.value }))
              }
              placeholder="Explique como o agente deve agir, responder e decidir."
            />
          </label>

          <label className="agent-center-field">
            <span>Base de conhecimento</span>
            <textarea
              value={form.knowledgeBase}
              onChange={(event) =>
                setForm((current) => ({ ...current, knowledgeBase: event.target.value }))
              }
              placeholder="Cole regras, contexto de negocio, produtos, politicas e respostas comuns."
            />
          </label>

          <button
            className={advancedOpen ? 'agent-center-advanced is-open' : 'agent-center-advanced'}
            type="button"
            onClick={() => setAdvancedOpen((current) => !current)}
          >
            <span className="agent-center-advanced-copy">
              <strong>Configuracoes avancadas</strong>
              <small>API propria, tools permitidas, canais e status do agente.</small>
            </span>
            <ChevronDown size={16} />
          </button>

          <div className="agent-center-actions">
            <button className="agent-center-primary-btn" type="submit">
              <Bot size={15} />
              Criar agente
            </button>
          </div>
        </form>

        <aside className="agent-center-panel agent-center-side-panel">
          <div className="agent-center-panel-head">
            <strong>Liberar modulo</strong>
          </div>

          <div className="agent-center-side-content">
            <div className="agent-center-side-card">
              <Shield size={18} />
              <div>
                <strong>Acesso do modulo</strong>
                <p>SUPER_ADMIN controla quem pode criar, editar e publicar agentes.</p>
              </div>
            </div>

            <div className="agent-center-side-card">
              <KeyRound size={18} />
              <div>
                <strong>Estado da fila</strong>
                <p>{queueSummary}</p>
              </div>
            </div>

            <div className="agent-center-side-note">
              <strong>Boas praticas</strong>
              <p>
                Libere o modulo apenas para quem conhece regras, canais e limites de autonomia do
                agente.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="agent-center-panel agent-center-available">
        <div className="agent-center-panel-head">
          <strong>Agentes disponiveis</strong>
        </div>

        <div className="agent-center-cards">
          {hasLoadingError ? (
            <div className="agent-center-empty">
              <UserRoundCog size={18} />
              <span>Falha ao carregar agentes e fila. Tente novamente.</span>
            </div>
          ) : loading ? (
            <div className="agent-center-empty">
              <UserRoundCog size={18} />
              <span>Carregando agentes reais da API...</span>
            </div>
          ) : availableAgents.length ? (
            availableAgents.map((agent) => (
              <article key={agent.id} className="agent-center-card">
                <div className="agent-center-card-head">
                  <div>
                    <strong>{agent.name}</strong>
                    <p>{agent.description || 'Agente configurado para operar com clareza.'}</p>
                  </div>

                  <div className="agent-center-card-actions">
                    <span className="agent-center-status">{agent.status}</span>
                    <button type="button" aria-label="Editar agente">
                      <Pencil size={14} />
                    </button>
                    <button type="button" aria-label="Excluir agente">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="agent-center-card-meta">
                  <span>Modulo: {agent.moduleName.toLowerCase()}</span>
                  <span>Slug: {agent.slug}</span>
                  <span>Modelo: {agent.model}</span>
                  <span>Modo padrao: {formatMode(agent.mode)}</span>
                  <span>Numero vinculado: {agent.linkedNumber}</span>
                  <span>Chave propria: {agent.ownKey}</span>
                  <span>Dominio: {agent.domain || 'geral'}</span>
                  <span>Fila: {agent.queue || 'sem fila associada'}</span>
                </div>

                <div className="agent-center-skill-list">
                  {agent.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="agent-center-empty">
              <UserRoundCog size={18} />
              <span>Nenhum agente disponivel no momento.</span>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
