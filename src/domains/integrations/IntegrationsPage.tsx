'use client';

import { useState } from 'react';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';
import { ZyrHint } from '@/shared/ui/zyr/ZyrStates';

type IntegrationCard = {
  name: string;
  status: 'CONNECTED' | 'PENDING' | 'DISABLED';
  detail: string;
  primaryAction: string;
  lastSync: string;
};

const integrations: IntegrationCard[] = [
  {
    name: 'Instagram',
    status: 'PENDING',
    detail: 'Captura de DM, comentarios e roteamento de leads.',
    primaryAction: 'Conectar conta',
    lastSync: 'Aguardando permissao',
  },
  {
    name: 'Facebook',
    status: 'CONNECTED',
    detail: 'Inbox de paginas e suporte a promocao de eventos.',
    primaryAction: 'Revisar permissoes',
    lastSync: 'Sincronizado ha 12 min',
  },
  {
    name: 'YouTube',
    status: 'CONNECTED',
    detail: 'Conteudo do canal e ativos de aprendizagem.',
    primaryAction: 'Sincronizar playlists',
    lastSync: 'Sincronizado ha 1 h',
  },
  {
    name: 'Gmail',
    status: 'DISABLED',
    detail: 'Email transacional e notificacoes operacionais.',
    primaryAction: 'Ativar integracao',
    lastSync: 'Desativado pelo operador',
  },
];

function integrationBadgeClass(status: IntegrationCard['status']) {
  if (status === 'CONNECTED') {
    return 'badge badge-active';
  }

  if (status === 'DISABLED') {
    return 'badge badge-inactive';
  }

  return 'badge badge-draft';
}

export function IntegrationsPage() {
  const [message, setMessage] = useState('Area de integracoes pronta.');

  return (
    <section className="hero-surface wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.04}>
            <p className="eyebrow">Integracoes</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2>Portas externas e canais de crescimento.</h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p>
              A tela de integracoes precisa parecer uma camada de produto premium: canais,
              permissões e sincronização aparecem com clareza e sem ruído administrativo.
            </p>
          </FadeIn>
          <div className="summary-row" style={{ marginTop: 16 }}>
            <div className="pill">4 integrações-chave</div>
            <div className="pill pill-ghost">Status visivel</div>
            <div className="pill pill-ghost">Sincronia operacional</div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <ZyrHint
            title="Zyr usa integracoes como portas de entrada"
            description="Instagram, Facebook, YouTube e Gmail devem mostrar status, proximo passo e ultimo sync sem obrigar o operador a interpretar log."
            tips={[
              'mostre permissao pendente com clareza',
              'deixe ultimo sync sempre visivel',
              'ligue cada integracao a um fluxo util',
            ]}
          />
          <div className="pill">{message}</div>
          <div className="panel panel-accent">
            <strong>Principio de sincronizacao</strong>
            <p>
              Integracoes precisam mostrar status, permissao e ultimo sync bem-sucedido para que
              o operador aja sem adivinhar.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <StaggerGroup className="integration-grid" delayChildren={0.08} staggerChildren={0.06}>
          {integrations.map((integration) => (
            <StaggerItem key={integration.name}>
              <article className="integration-card panel panel-accent">
                <div className="panel-head">
                  <div>
                    <strong>{integration.name}</strong>
                    <p className="muted" style={{ marginTop: 6 }}>
                      {integration.detail}
                    </p>
                  </div>
                  <span className={integrationBadgeClass(integration.status)}>
                    {integration.status}
                  </span>
                </div>
                <div className="flow-stack">
                  <div className="flow-card">
                    <small>Ultimo sync</small>
                    <div>{integration.lastSync}</div>
                  </div>
                </div>
                <div className="summary-row">
                  <button type="button" onClick={() => setMessage(`${integration.name} acionada.`)}>
                    {integration.primaryAction}
                  </button>
                  <span className="pill pill-ghost">Operacao guiada</span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
