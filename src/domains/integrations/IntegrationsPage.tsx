'use client';

import { CheckCircle2, Image, Mail, RefreshCw, Video, WalletCards } from 'lucide-react';

type IntegrationCard = {
  name: string;
  status: 'CONNECTED' | 'PENDING' | 'DISABLED';
  detail: string;
  primaryAction: string;
  lastSync: string;
  icon: typeof Image;
  channel: string;
};

const integrations: IntegrationCard[] = [
  {
    name: 'Instagram',
    status: 'PENDING',
    detail: 'Captura DM, comentários e encaminha leads para o fluxo de atendimento.',
    primaryAction: 'Conectar conta',
    lastSync: 'Aguardando permissão',
    icon: Image,
    channel: 'Social',
  },
  {
    name: 'Facebook',
    status: 'CONNECTED',
    detail: 'Inbox das páginas, campanhas e roteamento para eventos publicados.',
    primaryAction: 'Revisar permissões',
    lastSync: 'Sincronizado há 12 min',
    icon: WalletCards,
    channel: 'Social',
  },
  {
    name: 'YouTube',
    status: 'CONNECTED',
    detail: 'Playlists, conteúdos educacionais e materiais de apoio do canal.',
    primaryAction: 'Sincronizar playlists',
    lastSync: 'Sincronizado há 1 h',
    icon: Video,
    channel: 'Conteúdo',
  },
  {
    name: 'Gmail',
    status: 'DISABLED',
    detail: 'E-mail transacional, avisos operacionais e alertas administrativos.',
    primaryAction: 'Ativar integração',
    lastSync: 'Desativado pelo operador',
    icon: Mail,
    channel: 'E-mail',
  },
];

function integrationStatusClass(status: IntegrationCard['status']) {
  if (status === 'CONNECTED') return 'integration-center-status is-connected';
  if (status === 'PENDING') return 'integration-center-status is-pending';
  return 'integration-center-status is-disabled';
}

export function IntegrationsPage() {
  const connectedCount = integrations.filter((item) => item.status === 'CONNECTED').length;
  const pendingCount = integrations.filter((item) => item.status === 'PENDING').length;

  return (
    <section className="integration-center-page">
      <header className="integration-center-hero">
        <div className="integration-center-copy">
          <span className="integration-center-kicker">Integrações</span>
          <h1>Portas externas, canais de crescimento e sincronização do ecossistema.</h1>
          <p>
            O operador precisa enxergar o estado de cada integração, quando ela sincronizou e qual
            o próximo passo sem abrir telas técnicas demais.
          </p>
        </div>

        <div className="integration-center-badges">
          <span className="integration-center-badge">{connectedCount} conectadas</span>
          <span className="integration-center-badge is-pending">{pendingCount} pendentes</span>
        </div>
      </header>

      <section className="integration-center-metrics">
        <article className="integration-center-metric-card">
          <span>Último sync geral</span>
          <strong>12 min</strong>
          <small>Facebook atualizado mais recentemente</small>
        </article>
        <article className="integration-center-metric-card">
          <span>Canais ativos</span>
          <strong>{connectedCount}</strong>
          <small>Prontos para uso operacional</small>
        </article>
        <article className="integration-center-metric-card">
          <span>Aguardando ação</span>
          <strong>{pendingCount + 1}</strong>
          <small>Permissões ou ativação manual</small>
        </article>
      </section>

      <section className="integration-center-grid">
        {integrations.map((integration) => {
          const Icon = integration.icon;

          return (
            <article key={integration.name} className="integration-center-card">
              <div className="integration-center-card-head">
                <div className="integration-center-card-title">
                  <div className="integration-center-icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <strong>{integration.name}</strong>
                    <small>{integration.channel}</small>
                  </div>
                </div>
                <span className={integrationStatusClass(integration.status)}>{integration.status}</span>
              </div>

              <p>{integration.detail}</p>

              <div className="integration-center-meta">
                <span>Último sync: {integration.lastSync}</span>
                <span>Canal: {integration.channel}</span>
              </div>

              <div className="integration-center-actions">
                <button type="button">
                  {integration.status === 'CONNECTED' ? <RefreshCw size={14} /> : <CheckCircle2 size={14} />}
                  {integration.primaryAction}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="integration-center-bottom">
        <article className="integration-center-note-card is-highlight">
          <strong>Zyr usa integrações como portas de entrada</strong>
          <p>
            Cada card precisa deixar claro se a integração está conectada, quando sincronizou e o
            que o operador deve fazer agora.
          </p>
          <div className="integration-center-note-list">
            <span>Último sync sempre visível</span>
            <span>Status sem ambiguidade</span>
            <span>Ação primária única</span>
          </div>
        </article>

        <article className="integration-center-note-card">
          <strong>Próximos passos sugeridos</strong>
          <p>
            Conectar o Instagram, revisar permissões do Facebook, sincronizar playlists do
            YouTube e decidir se o Gmail volta para a operação.
          </p>
        </article>
      </section>
    </section>
  );
}
