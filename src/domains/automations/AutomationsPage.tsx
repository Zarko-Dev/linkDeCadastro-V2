'use client';

import { useState } from 'react';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';
import { ZyrHint } from '@/shared/ui/zyr/ZyrStates';

type AutomationDraft = {
  name: string;
  trigger: string;
  condition: string;
  action: string;
  target: string;
};

const defaultDraft: AutomationDraft = {
  name: 'Novo follow-up de lead',
  trigger: 'form_submitted',
  condition: 'contact_has_whatsapp',
  action: 'send_message_and_assign_agent',
  target: 'chat-main',
};

const automationCards = [
  {
    title: 'Aquecimento de lead',
    status: 'ACTIVE',
    summary: 'Dispara no envio do formulario, roteia para o WhatsApp e atribui um copiloto.',
  },
  {
    title: 'Fluxo abandonado',
    status: 'PAUSED',
    summary: 'Detecta leads inativos e reengaja depois de um atraso.',
  },
  {
    title: 'Handoff de agente',
    status: 'ACTIVE',
    summary: 'Move uma thread da automacao para um operador humano quando necessario.',
  },
];

export function AutomationsPage() {
  const [draft, setDraft] = useState<AutomationDraft>(defaultDraft);
  const [message, setMessage] = useState('Estudio de automacoes pronto.');

  return (
    <section className="hero-surface wide-page automation-layout">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.04}>
            <p className="eyebrow">Automacoes</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2>Estudio de automacao orientado a decisao.</h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p>
              O fluxo precisa parecer um pipeline real: trigger, condition, action e target
              precisam ser lidos como uma cadeia unica, nao como configuracoes soltas.
            </p>
          </FadeIn>
          <div className="summary-row">
            <div className="pill">Trigger</div>
            <div className="pill pill-ghost">Condition</div>
            <div className="pill pill-ghost">Action</div>
            <div className="pill pill-ghost">Target</div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <ZyrHint
            title="Zyr pensa automacao como cadeia de acao"
            description="A tela precisa mostrar o raciocinio do fluxo antes do clique de salvar. A arquitetura visual deve deixar claro o que inicia, filtra, dispara e onde termina."
            tips={[
              'gatilho sempre visivel',
              'condicao como filtro humano-legivel',
              'destino ligado a um canal real',
            ]}
          />
          <div className="panel panel-accent">
            <strong>Linguagem de fluxo</strong>
            <p>
              O desktop deve parecer um painel de decisão, nao uma lista solta de configurações.
            </p>
          </div>
          <div className="panel">
            <strong>Critica da V2</strong>
            <p>
              Cada automacao precisa nascer com objetivo, entrada clara e entrega acoplada a uma
              acao concreta.
            </p>
          </div>
        </div>
      </div>

      <div className="builder-layout" style={{ marginTop: 18 }}>
        <article className="panel form-card">
          <div className="panel-head">
            <strong>Rascunho da automacao</strong>
            <span className="pill pill-ghost">Builder</span>
          </div>
          <div className="stack form-grid" style={{ marginTop: 14 }}>
            <label className="field-block">
              <span>Nome</span>
              <input
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
            </label>
            <label className="field-block">
              <span>Gatilho</span>
              <input
                value={draft.trigger}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, trigger: event.target.value }))
                }
              />
            </label>
            <label className="field-block">
              <span>Condicao</span>
              <input
                value={draft.condition}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, condition: event.target.value }))
                }
              />
            </label>
            <label className="field-block">
              <span>Acao</span>
              <input
                value={draft.action}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, action: event.target.value }))
                }
              />
            </label>
            <label className="field-block">
              <span>Destino</span>
              <input
                value={draft.target}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, target: event.target.value }))
                }
              />
            </label>
            <button type="button" onClick={() => setMessage(`Rascunho pronto para ${draft.name}.`)}>
              Preparar automacao
            </button>
          </div>
          <p className="muted" style={{ marginTop: 12 }}>
            O fluxo ideal sempre pode ser entendido sem abrir a documentação.
          </p>
        </article>

        <div className="stack">
          <article className="panel panel-accent">
            <div className="panel-head">
              <strong>Preview do fluxo</strong>
              <span className="badge badge-active">Sequencia</span>
            </div>
            <div className="stack automation-flow" style={{ marginTop: 12 }}>
              <div className="builder-step">
                <strong>{draft.trigger}</strong>
                <small>Gatilho</small>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="builder-step">
                <strong>{draft.condition}</strong>
                <small>Condicao</small>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="builder-step">
                <strong>{draft.action}</strong>
                <small>Acao</small>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="builder-step">
                <strong>{draft.target}</strong>
                <small>Destino</small>
              </div>
            </div>
          </article>

          <div className="panel">
            <strong>Estado do estúdio</strong>
            <p className="muted">{message}</p>
          </div>

          <StaggerGroup className="feature-grid" delayChildren={0.08} staggerChildren={0.06}>
            {automationCards.map((automation) => (
              <StaggerItem key={automation.title}>
                <article className="panel">
                  <div className="panel-head">
                    <strong>{automation.title}</strong>
                    <span className={automation.status === 'ACTIVE' ? 'badge badge-active' : 'badge badge-draft'}>
                      {automation.status}
                    </span>
                  </div>
                  <p>{automation.summary}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
