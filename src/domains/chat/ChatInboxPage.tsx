'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  CalendarDays,
  CircleHelp,
  Clock3,
  DollarSign,
  FileText,
  MoreVertical,
  Paperclip,
  Search,
  SendHorizontal,
  Sparkles,
  UserRound,
} from 'lucide-react';

import { apiFetch, ApiFetchError } from '@/shared/lib/api';

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

const defaultSendTextForm: SendTextForm = {
  instance: '',
  number: '',
  text: '',
  delay: '0',
  linkPreview: true,
};

export function ChatInboxPage() {
  const [data, setData] = useState<ConversationsResponse | null>(null);
  const [queue, setQueue] = useState<QueueStatusResponse | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [sendTextForm, setSendTextForm] = useState<SendTextForm>(defaultSendTextForm);
  const [sendTextMessage, setSendTextMessage] = useState('Carregando inbox...');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'ai'>('all');

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
      .then(() => setSendTextMessage('Pronto para enviar mensagens via Evolution.'))
      .catch((error: { message?: string }) => {
        setSendTextMessage(error?.message || 'Falha ao carregar o chat.');
      });
  }, []);

  const selectedConversation =
    data?.items.find((item) => item.id === selectedConversationId) || data?.items[0] || null;

  const filteredConversations = useMemo(() => {
    const items = data?.items || [];

    if (activeFilter === 'unread') {
      return items.filter((item) => (item.unreadCount || 0) > 0);
    }

    if (activeFilter === 'ai') {
      return items.filter((item) => (item.attendanceMode || '').toLowerCase().includes('ai'));
    }

    return items;
  }, [activeFilter, data]);

  const queueSummary = useMemo(() => {
    if (!queue) return 'Fila indisponivel';

    const totalQueued = queue.queues.reduce((sum, item) => sum + item.queued, 0);

    return `${queue.status} • ${totalQueued} pendencias`;
  }, [queue]);

  useEffect(() => {
    if (!selectedConversation?.contactNumber) return;

    setSendTextForm((current) => ({
      ...current,
      number: selectedConversation.contactNumber || '',
    }));
  }, [selectedConversation?.contactNumber]);

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
      setSendTextForm((current) => ({
        ...current,
        text: '',
        delay: '0',
        linkPreview: true,
      }));
      await refresh();
    } catch (error) {
      setSendTextMessage(error instanceof ApiFetchError ? error.message : 'Falha ao enviar mensagem.');
    }
  }

  return (
    <section className="wppdesk-page">
      <div className="wppdesk-shell">
        <aside className="wppdesk-sidebar">
          <div className="wppdesk-search">
            <Search size={16} />
            <input placeholder="Buscar conversas..." />
          </div>

          <div className="wppdesk-sidebar-head">
            <div>
              <strong>Inbox</strong>
              <span>{filteredConversations.length} conversas visiveis</span>
            </div>
            <span className="wppdesk-count-pill">{data?.meta.total ?? 0} ativas</span>
          </div>

          <div className="wppdesk-filter-row">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={activeFilter === 'all' ? 'wppdesk-filter is-active' : 'wppdesk-filter'}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={activeFilter === 'unread' ? 'wppdesk-filter is-active' : 'wppdesk-filter'}
            >
              Nao lidos
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ai')}
              className={activeFilter === 'ai' ? 'wppdesk-filter is-active' : 'wppdesk-filter'}
            >
              IA ativa
            </button>
          </div>

          <div className="wppdesk-conversation-list">
            {filteredConversations.map((conversation) => {
              const isActive = selectedConversationId === conversation.id;
              const label = conversation.contactName || conversation.contactNumber || 'Contato';

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={isActive ? 'wppdesk-conversation is-active' : 'wppdesk-conversation'}
                >
                  <span className="wppdesk-avatar">{label.charAt(0)}</span>
                  <span className="wppdesk-conversation-copy">
                    <span className="wppdesk-conversation-top">
                      <strong>{label}</strong>
                      <small>{(conversation.unreadCount || 0) > 0 ? 'Agora' : '14:22'}</small>
                    </span>
                    <span className="wppdesk-conversation-text">
                      {conversation.lastMessage || 'Sem ultima mensagem.'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="wppdesk-thread">
          <header className="wppdesk-thread-topbar">
            <div className="wppdesk-thread-actions-left">
              <button type="button" className="wppdesk-icon-btn" aria-label="Notificacoes">
                <Bell size={16} />
              </button>
              <button type="button" className="wppdesk-icon-btn" aria-label="Ajuda">
                <CircleHelp size={16} />
              </button>
            </div>

            <div className="wppdesk-thread-status">
              <span>WhatsApp Cloud</span>
              <i />
            </div>
          </header>

          <div className="wppdesk-thread-header">
            <div className="wppdesk-thread-contact">
              <span className="wppdesk-avatar large">
                {(selectedConversation?.contactName || selectedConversation?.contactNumber || 'C')
                  .charAt(0)
                  .toUpperCase()}
              </span>
              <div>
                <strong>
                  {selectedConversation?.contactName || selectedConversation?.contactNumber || 'Contato'}
                </strong>
                <span>
                  Agente IA • {selectedConversation?.status || 'RESPONDENDO'}
                </span>
              </div>
            </div>

            <div className="wppdesk-thread-toolbar">
              <button type="button" className="wppdesk-pill-btn">
                Pausar IA
              </button>
              <button type="button" className="wppdesk-icon-btn">
                <Search size={16} />
              </button>
              <button type="button" className="wppdesk-icon-btn">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <div className="wppdesk-chat-area">
            <article className="wppdesk-message incoming">
              <p>
                O historico detalhado de mensagens ainda nao esta exposto pela API deste ambiente.
                A lista de conversas, a fila e o envio real ja funcionam.
              </p>
              <div className="wppdesk-message-meta">
                <span>Sistema</span>
                <small>{queueSummary}</small>
              </div>
            </article>

            <article className="wppdesk-message outgoing">
              <p>
                {selectedConversation?.lastMessage ||
                  'Selecione uma conversa para ver o contexto resumido.'}
              </p>
              <div className="wppdesk-message-meta">
                <span>Preview</span>
                <small>{selectedConversation?.attendanceMode || 'Sem modo informado'}</small>
              </div>
            </article>
          </div>

          <div className="wppdesk-quick-actions">
            <button type="button">Enviar template</button>
            <button type="button">Mover para CRM</button>
            <button type="button">Anexar</button>
          </div>

          <form onSubmit={handleSendTextSubmit} className="wppdesk-composer">
            <input
              value={sendTextForm.text}
              onChange={(event) =>
                setSendTextForm((current) => ({ ...current, text: event.target.value }))
              }
              placeholder="Digite sua mensagem aqui..."
            />
            <div className="wppdesk-composer-actions">
              <button type="button" className="wppdesk-icon-btn" aria-label="Anexar">
                <Paperclip size={16} />
              </button>
              <button type="submit" className="wppdesk-send-btn" aria-label="Enviar">
                <SendHorizontal size={18} />
              </button>
            </div>
          </form>

          <p className="wppdesk-composer-feedback" aria-live="polite">
            {sendTextMessage} | {queueSummary}
          </p>
        </main>

        <aside className="wppdesk-profile">
          <div className="wppdesk-profile-card">
            <div className="wppdesk-profile-avatar">
              {(selectedConversation?.contactName || selectedConversation?.contactNumber || 'C')
                .charAt(0)
                .toUpperCase()}
            </div>
            <strong>{selectedConversation?.contactName || 'Contato sem nome'}</strong>
            <span>{selectedConversation?.contactNumber || 'Sem numero informado'}</span>
          </div>

          <div className="wppdesk-profile-stats">
            <article>
              <small>Status</small>
              <strong>{selectedConversation?.status || 'Sem status'}</strong>
            </article>
            <article>
              <small>Fila</small>
              <strong>{queue?.status || 'Indisponivel'}</strong>
            </article>
          </div>

          <div className="wppdesk-info-card">
            <span>Contexto real</span>
            <ul>
              <li>
                <Building2 size={15} />
                <div>
                  <small>Conversa</small>
                  <strong>{selectedConversation?.contactName || 'Sem nome'}</strong>
                </div>
              </li>
              <li>
                <FileText size={15} />
                <div>
                  <small>Ultima mensagem</small>
                  <strong>{selectedConversation?.lastMessage || 'Nao informada'}</strong>
                </div>
              </li>
              <li>
                <UserRound size={15} />
                <div>
                  <small>Modo de atendimento</small>
                  <strong>{selectedConversation?.attendanceMode || 'Nao informado'}</strong>
                </div>
              </li>
            </ul>
          </div>

          <div className="wppdesk-info-card">
            <span>Fila Evolution</span>
            <div className="wppdesk-tag-list">
              <span>{queue?.workers.length || 0} workers</span>
              <span>{queue?.queues.length || 0} filas</span>
            </div>
          </div>

          <div className="wppdesk-info-card">
            <span>Atalhos</span>
            <div className="wppdesk-shortcuts">
              <button type="button">
                <CalendarDays size={15} />
                Agenda
              </button>
              <button type="button">
                <DollarSign size={15} />
                Fatura
              </button>
              <button type="button">
                <Clock3 size={15} />
                Logs
              </button>
              <button type="button">
                <Sparkles size={15} />
                Builder
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
