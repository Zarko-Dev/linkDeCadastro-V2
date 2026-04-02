'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';
import { ZyrHint } from '@/shared/ui/zyr/ZyrStates';

type ConversationsResponse = {
  items: Array<{
    id: string;
    contactName?: string;
    contactNumber?: string;
    lastMessage?: string;
    unreadCount?: number;
    attendanceMode?: string;
    status?: string;
  }>;
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

type JobResponse = {
  accepted: boolean;
  jobId: string;
  status: string;
};

type SendTextForm = {
  instance: string;
  number: string;
  text: string;
  delay: string;
  linkPreview: boolean;
};

type CampaignForm = {
  instance: string;
  recipients: string;
  text: string;
  delay: string;
  linkPreview: boolean;
};

const defaultSendTextForm: SendTextForm = {
  instance: '',
  number: '',
  text: '',
  delay: '0',
  linkPreview: true,
};

const defaultCampaignForm: CampaignForm = {
  instance: '',
  recipients: '5511999999999, Joao Silva\n5511888888888, Maria Souza',
  text: '',
  delay: '0',
  linkPreview: true,
};

export function ChatInboxPage() {
  const [data, setData] = useState<ConversationsResponse | null>(null);
  const [queue, setQueue] = useState<QueueStatusResponse | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [sendTextForm, setSendTextForm] = useState<SendTextForm>(defaultSendTextForm);
  const [campaignForm, setCampaignForm] = useState<CampaignForm>(defaultCampaignForm);
  const [sendTextMessage, setSendTextMessage] = useState('Carregando inbox...');
  const [campaignMessage, setCampaignMessage] = useState('Carregando campanhas...');

  async function refresh() {
    const [conversations, queueStatus] = await Promise.all([
      apiFetch<ConversationsResponse>('/v2/chat/conversations'),
      apiFetch<QueueStatusResponse>('/v2/platform/queue/status'),
    ]);

    setData(conversations);
    setQueue(queueStatus);
    setSelectedConversationId((current) => current || conversations.items[0]?.id || null);
  }

  useEffect(() => {
    refresh()
      .then(() => {
        setSendTextMessage('Pronto para enviar mensagens via Evolution.');
        setCampaignMessage('Pronto para campanhas em fila.');
      })
      .catch((error: { message?: string }) => {
        const message = error?.message || 'Falha ao carregar o chat.';
        setSendTextMessage(message);
        setCampaignMessage(message);
      });
  }, []);

  const queueSummary = useMemo(() => {
    if (!queue) return 'Fila indisponivel';

    const totalQueued = queue.queues.reduce((sum, item) => sum + item.queued, 0);
    const totalProcessing = queue.queues.reduce((sum, item) => sum + item.processing, 0);
    const totalFailed = queue.queues.reduce((sum, item) => sum + item.failed, 0);

    return `${queue.status} | ${totalQueued} na fila | ${totalProcessing} processando | ${totalFailed} falhas`;
  }, [queue]);

  const selectedConversation =
    data?.items.find((item) => item.id === selectedConversationId) || data?.items[0] || null;

  const queueQueueCard = queue?.queues[0];

  async function handleSendTextSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSendTextMessage('Enfileirando mensagem...');

    try {
      const payload = {
        instance: sendTextForm.instance || undefined,
        number: sendTextForm.number.trim(),
        text: sendTextForm.text.trim(),
        delay: Number(sendTextForm.delay || 0),
        linkPreview: sendTextForm.linkPreview,
      };

      const result = await apiFetch<JobResponse>('/v2/chat/send-text', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSendTextMessage(`Job ${result.jobId} aceito. O Evolution vai processar em segundo plano.`);
      setSendTextForm(defaultSendTextForm);
      await refresh();
    } catch (error: any) {
      setSendTextMessage(error?.message || 'Falha ao enviar mensagem.');
    }
  }

  async function handleCampaignSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCampaignMessage('Enfileirando campanha...');

    try {
      const recipients = campaignForm.recipients
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [number, ...nameParts] = line.split(',');
          return {
            number: number.trim(),
            name: nameParts.join(',').trim() || undefined,
          };
        })
        .filter((recipient) => recipient.number.length > 0);

      const payload = {
        instance: campaignForm.instance || undefined,
        text: campaignForm.text.trim(),
        recipients,
        delay: Number(campaignForm.delay || 0),
        linkPreview: campaignForm.linkPreview,
      };

      const result = await apiFetch<JobResponse>('/v2/chat/campaigns/send', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setCampaignMessage(`Campanha aceita como job ${result.jobId}.`);
      setCampaignForm(defaultCampaignForm);
      await refresh();
    } catch (error: any) {
      setCampaignMessage(error?.message || 'Falha ao enfileirar campanha.');
    }
  }

  return (
    <section className="wide-page chat-layout">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.04}>
            <p className="eyebrow">WhatsApp chat</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2>Inbox operacional para leads, campanhas e handoff.</h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p>
              No celular, a thread precisa ser facil de abrir e agir. No desktop, o mesmo fluxo
              ganha contexto de fila, historico e composer sem parecer um painel antigo.
            </p>
          </FadeIn>

          <div className="quick-actions">
            <div className="quick-action">
              <span className="quick-action-label">Inbox</span>
              <span className="quick-action-meta">{data?.meta.total || 0} conversas ativas.</span>
            </div>
            <div className="quick-action">
              <span className="quick-action-label">Fila</span>
              <span className="quick-action-meta">{queueSummary}</span>
            </div>
            <div className="quick-action">
              <span className="quick-action-label">Evolution</span>
              <span className="quick-action-meta">Envio e status em segundo plano.</span>
            </div>
            <div className="quick-action">
              <span className="quick-action-label">Zyr</span>
              <span className="quick-action-meta">Ajuda com triagem, tom e proximo passo.</span>
            </div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <div className="pill">{queueSummary}</div>
          <div className="panel panel-accent">
            <strong>Modelo de acao</strong>
            <p>
              Cada thread precisa mostrar fila, status e contexto para o operador agir sem sair
              da plataforma.
            </p>
          </div>
          <ZyrHint
            title="Zyr ajuda a decidir o proximo passo"
            description="Quando a conversa pede contexto, o Zyr pode sugerir se o melhor movimento e responder, escalar, agendar ou disparar campanha."
            tips={[
              'mantenha o inbox como a superficie principal no mobile',
              'diferencie mensagem manual de campanha em fila',
              'sempre mostre status, unread e worker associado',
            ]}
          />
          <div className="panel">
            <strong>Workers ativos</strong>
            <p className="muted">
              {queue?.workers?.length ? queue.workers.join(' | ') : 'Nenhum worker registrado ainda'}
            </p>
          </div>
        </div>
      </div>

      <div className="chat-board">
        <article className="panel chat-conversation-list">
          <div className="panel-head">
            <div>
              <strong>Conversas</strong>
              <p className="muted">Selecione uma thread para inspecionar o fluxo operacional.</p>
            </div>
            <span className="badge badge-active">Inbox ativo</span>
          </div>

          <StaggerGroup className="stack" delayChildren={0.08} staggerChildren={0.06}>
            {(data?.items || []).map((conversation) => (
              <StaggerItem key={conversation.id}>
                <button
                  type="button"
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`conversation-card conversation-select interactive-card ${
                    selectedConversationId === conversation.id ? 'is-selected' : ''
                  }`}
                >
                  <div className="conversation-top">
                    <strong>{conversation.contactName || conversation.contactNumber}</strong>
                    <span className="pill">{conversation.status || 'OPEN'}</span>
                  </div>
                  <p>{conversation.lastMessage || 'Sem ultima mensagem.'}</p>
                  <small>
                    {conversation.attendanceMode || 'N/A'} | {conversation.unreadCount || 0} nao lidas
                  </small>
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </article>

        <article className="panel chat-thread">
          <div className="panel-head">
            <div>
              <strong>Preview da thread</strong>
              <p className="muted" style={{ marginTop: 6 }}>
                {selectedConversation
                  ? `${selectedConversation.contactName || selectedConversation.contactNumber} | ${selectedConversation.status || 'OPEN'}`
                  : 'Nenhuma conversa selecionada'}
              </p>
            </div>
            <span className="badge badge-active">Painel ativo</span>
          </div>

          <div className="stack">
            <div className="thread-message thread-message-in">
              <strong>Lead</strong>
              <p>Oi, preciso de ajuda com cadastro e acesso.</p>
            </div>
            <div className="thread-message thread-message-out">
              <strong>Operador</strong>
              <p>Perfeito, vou encaminhar para o fluxo e agente certo.</p>
            </div>
            <div className="thread-message thread-message-system">
              <strong>Sistema</strong>
              <p>
                O status da fila fica visivel na lateral e a conversa permanece vinculada ao
                workspace operacional.
              </p>
            </div>
          </div>
        </article>

        <div className="workspace-side-stack">
          <article className="panel form-card sticky-panel">
            <strong>Enviar texto</strong>
            <form className="stack form-grid" onSubmit={handleSendTextSubmit}>
              <input
                value={sendTextForm.instance}
                onChange={(event) =>
                  setSendTextForm((current) => ({ ...current, instance: event.target.value }))
                }
                placeholder="Instancia opcional"
              />
              <input
                value={sendTextForm.number}
                onChange={(event) =>
                  setSendTextForm((current) => ({ ...current, number: event.target.value }))
                }
                placeholder="Numero com DDI"
              />
              <textarea
                value={sendTextForm.text}
                onChange={(event) =>
                  setSendTextForm((current) => ({ ...current, text: event.target.value }))
                }
                placeholder="Mensagem"
                rows={5}
              />
              <div className="field-row">
                <input
                  value={sendTextForm.delay}
                  onChange={(event) =>
                    setSendTextForm((current) => ({ ...current, delay: event.target.value }))
                  }
                  placeholder="Delay"
                  type="number"
                  min="0"
                />
                <label className="checkbox">
                  <input
                    checked={sendTextForm.linkPreview}
                    onChange={(event) =>
                      setSendTextForm((current) => ({
                        ...current,
                        linkPreview: event.target.checked,
                      }))
                    }
                    type="checkbox"
                  />
                  Preview de link
                </label>
              </div>
              <button type="submit">Enviar via Evolution</button>
            </form>
            <p className="muted" aria-live="polite">
              {sendTextMessage}
            </p>
          </article>

          <article className="panel form-card">
            <strong>Fila de campanha</strong>
            <form className="stack form-grid" onSubmit={handleCampaignSubmit}>
              <input
                value={campaignForm.instance}
                onChange={(event) =>
                  setCampaignForm((current) => ({ ...current, instance: event.target.value }))
                }
                placeholder="Instancia opcional"
              />
              <textarea
                value={campaignForm.recipients}
                onChange={(event) =>
                  setCampaignForm((current) => ({ ...current, recipients: event.target.value }))
                }
                placeholder="Um contato por linha: numero, nome"
                rows={5}
              />
              <textarea
                value={campaignForm.text}
                onChange={(event) =>
                  setCampaignForm((current) => ({ ...current, text: event.target.value }))
                }
                placeholder="Texto da campanha"
                rows={5}
              />
              <div className="field-row">
                <input
                  value={campaignForm.delay}
                  onChange={(event) =>
                    setCampaignForm((current) => ({ ...current, delay: event.target.value }))
                  }
                  placeholder="Delay"
                  type="number"
                  min="0"
                />
                <label className="checkbox">
                  <input
                    checked={campaignForm.linkPreview}
                    onChange={(event) =>
                      setCampaignForm((current) => ({
                        ...current,
                        linkPreview: event.target.checked,
                      }))
                    }
                    type="checkbox"
                  />
                  Preview de link
                </label>
              </div>
              <button type="submit">Enviar campanha</button>
            </form>
            <p className="muted" aria-live="polite">
              {campaignMessage}
            </p>
          </article>

          <article className="panel">
            <strong>Fila e workers</strong>
            <p className="muted">
              {queueQueueCard
                ? `${queueQueueCard.name} | ${queueQueueCard.queued} na fila | ${queueQueueCard.processing} processando`
                : 'Fila nao disponivel ainda'}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
