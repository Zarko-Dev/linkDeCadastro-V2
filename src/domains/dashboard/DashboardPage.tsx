'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useState } from 'react';

import { apiFetch } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';
import { ZyrEmptyState, ZyrErrorState, ZyrHint } from '@/shared/ui/zyr/ZyrStates';

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
  databases?: {
    core: boolean;
    chat: boolean;
  };
};

type DashboardResponse = {
  auth: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  courses: {
    total: number;
  };
  events: {
    total: number;
  };
};

type EventsResponse = {
  items: Array<{
    id: string;
    title: string;
    slug: string;
    description?: string;
    status: string;
  }>;
  meta: {
    total: number;
  };
};

const quickActions: ReadonlyArray<{
  href: Route;
  title: string;
  note: string;
}> = [
  { href: '/events', title: 'Eventos', note: 'Operacao, vagas e follow-up.' },
  { href: '/form', title: 'Formulario', note: 'Converta intenção em acao.' },
  { href: '/chat', title: 'WhatsApp', note: 'Inbox, fila e resposta.' },
  { href: '/agents', title: 'Agentes', note: 'Copilot e autonomia guiada.' },
  { href: '/automations', title: 'Automacoes', note: 'Trigger, condicao e destino.' },
  { href: '/integrations', title: 'Integracoes', note: 'Conectividade e sync.' },
];

const executionFeed = [
  'Lead do formulario entrou na fila do WhatsApp com contexto completo',
  'Automacao de boas-vindas foi liberada para novos inscritos',
  'Agente copiloto recebeu a thread com prioridade operacional',
  'Integracao do canal social aguarda ultima revisao de permissao',
];

export function DashboardPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [events, setEvents] = useState<EventsResponse['items']>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      apiFetch<HealthResponse>('/v2/health'),
      apiFetch<DashboardResponse['auth']>('/v2/auth/me'),
      apiFetch<DashboardResponse['user']>('/v2/users/me'),
      apiFetch<{ meta: { total: number } }>('/v2/courses'),
      apiFetch<EventsResponse>('/v2/events'),
    ])
      .then(([healthData, authData, userData, coursesData, eventsData]) => {
        if (!mounted) return;

        setHealth(healthData);
        setDashboard({
          auth: authData,
          user: userData,
          courses: { total: coursesData.meta.total },
          events: { total: eventsData.meta.total },
        });
        setEvents(eventsData.items.slice(0, 3));
      })
      .catch((err: { message?: string }) => {
        if (mounted) {
          setError(err?.message || 'Erro ao consultar a API');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const featuredEvent = events[0];

  return (
    <section className="hero-surface wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.04}>
            <p className="eyebrow">Workspace</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2>Controle operacional com foco em agentes, automacoes e canais.</h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p>
              Esta home nao deve parecer um admin tradicional. Ela precisa se ler como um
              console premium que orienta acao, contexto e decisão em uma so camada.
            </p>
          </FadeIn>

          <div className="summary-row">
            <div className="pill">Saude: {health?.status ?? '...'}</div>
            <div className="pill pill-ghost">
              Core: {health?.databases?.core ? 'pronto' : 'pendente'}
            </div>
            <div className="pill pill-ghost">
              Chat: {health?.databases?.chat ? 'pronto' : 'pendente'}
            </div>
            <div className="pill pill-ghost">
              Perfil: {dashboard?.auth.role || 'aguardando'}
            </div>
          </div>

          <div className="panel panel-accent" style={{ marginTop: 16 }}>
            <div className="panel-head">
              <div>
                <span className="eyebrow">Centro de operacao</span>
                <strong>{featuredEvent?.title || 'Evento principal ainda nao definido'}</strong>
              </div>
              <span className="badge badge-active">
                {featuredEvent?.status || (error ? 'Atencao' : 'Carregando')}
              </span>
            </div>
            <p>
              O primeiro foco visual precisa mostrar o objeto de negocio principal, o estado e o
              proximo passo de operacao.
            </p>
            <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              <div className="panel">
                <span className="metric-label">Eventos</span>
                <strong>{dashboard?.events.total ?? '...'}</strong>
              </div>
              <div className="panel">
                <span className="metric-label">Cursos</span>
                <strong>{dashboard?.courses.total ?? '...'}</strong>
              </div>
              <div className="panel">
                <span className="metric-label">Agenda</span>
                <strong>18 slots</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <ZyrHint
            title="Zyr organiza a leitura por prioridade"
            description="A tela precisa puxar o olhar para o objeto certo: evento, conversa, agente e automacao. O apoio tecnico fica ao lado, nao na frente."
            tips={[
              'evento principal primeiro',
              'indicadores compactos e claros',
              'atalhos por acao, nao por tecnica',
            ]}
          />
          <div className="panel panel-accent">
            <strong>Workspace ativo</strong>
            <p>
              {dashboard
                ? `${dashboard.auth.name} | ${dashboard.auth.email}`
                : 'Sessao aguardando...'}
            </p>
          </div>
          <div className="panel">
            <strong>Leitura operacional</strong>
            <p>
              O cliente deve ver rapidamente o que esta em andamento, o que depende de agente e o
              que precisa de acao humana.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div className="dashboard-grid">
          {error ? (
            <ZyrErrorState
              title="Zyr encontrou ruido na leitura do dashboard"
              description={error}
              action={<button type="button" onClick={() => window.location.reload()}>Tentar novamente</button>}
            />
          ) : events.length ? (
            <StaggerGroup className="feature-grid" delayChildren={0.08} staggerChildren={0.06}>
              {events.map((event) => (
                <StaggerItem key={event.id}>
                  <article className="panel panel-accent">
                    <div className="panel-head">
                      <strong>{event.title}</strong>
                      <span className={event.status === 'ACTIVE' ? 'badge badge-active' : 'badge badge-draft'}>
                        {event.status}
                      </span>
                    </div>
                    <p>{event.description || 'Evento pronto para captação, agenda e follow-up.'}</p>
                    <div className="summary-row">
                      <span className="pill pill-ghost">{event.slug}</span>
                      <span className="pill">Formulario publico</span>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <ZyrEmptyState
              title="Zyr ainda nao recebeu um evento para destacar"
              description="Assim que o primeiro evento ativo entrar no core, esse bloco passa a virar o centro do dashboard."
              action={<Link href="/events">Criar ou revisar eventos</Link>}
            />
          )}

          <div className="stack">
            <div className="panel panel-accent">
              <strong>Execucao global</strong>
              <div className="timeline-list">
                {executionFeed.map((item) => (
                  <div key={item} className="timeline-item">
                    <span className="timeline-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <strong>Proximas acoes</strong>
              <div className="timeline-list">
                {[
                  'Confirmar o evento com maior ritmo de inscricao',
                  'Revisar formularios com condicoes e agenda',
                  'Responder o lead mais recente no WhatsApp',
                  'Ativar automacao do evento principal',
                ].map((item) => (
                  <div key={item} className="timeline-item">
                    <span className="timeline-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions" style={{ marginTop: 18 }}>
        <StaggerGroup className="action-grid" delayChildren={0.08} staggerChildren={0.05}>
          {quickActions.map((action) => (
            <StaggerItem key={action.href}>
              <Link className="action-card" href={action.href}>
                <span className="action-card-title">{action.title}</span>
                <span className="action-card-note">{action.note}</span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
