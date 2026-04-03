'use client';

import Link from 'next/link';

import {
  FadeIn,
  StaggerGroup,
  StaggerItem,
} from '@/shared/ui/motion/MotionPrimitives';
import {
  ZyrEmptyState,
  ZyrErrorState,
  ZyrHint,
} from '@/shared/ui/zyr/ZyrStates';

const navLinks = [
  { label: 'Painel', href: '/dashboard' },
  { label: 'Eventos', href: '/events' },
  { label: 'Formulários', href: '/form' },
  { label: 'WhatsApp', href: '/chat' },
  { label: 'Agentes', href: '/agents' },
  { label: 'Automações', href: '/automations' },
  { label: 'Integrações', href: '/integrations' },
] as const;

const heroStats = [
  { label: 'Eventos em foco', value: '18' },
  { label: 'Agentes ativos', value: '32' },
  { label: 'Mensagens/dia', value: '3.4k' },
] as const;

const eventHighlights = [
  {
    title: 'Growth Summit V2',
    status: 'Ao vivo',
    participants: '812 inscritos',
    focus: 'Dashboard prioriza eventos e gatilhos que fecham vendas.',
    nextStep: 'Roteamento Zyr para o WhatsApp + follow-up automático.',
  },
  {
    title: 'Operação Corona',
    status: 'Pré-evento',
    participants: '431 inscritos',
    focus: 'Fluxo híbrido de clínica + consultoria em campo.',
    nextStep: 'Formulário condicional com dados de saúde + agenda.',
  },
  {
    title: 'Barber Lab Meetup',
    status: 'Planejado',
    participants: '26 espaços confirmados',
    focus: 'Captura e indexação de leads com serviço e horário.',
    nextStep: 'Sincroniza com WhatsApp e agenda pública.',
  },
] as const;

const formFields = [
  { label: 'Nome completo', helper: 'Topo obrigatório para qualquer público.' },
  { label: 'CPF / documento', helper: 'Pergunta condicional apenas para eventos federais.' },
  { label: 'Data de nascimento', helper: 'Usada para qualificar jornada.' },
  { label: 'WhatsApp', helper: 'Conecta ao Evolution e ao CRM.' },
  { label: 'CEP / estado', helper: 'Dispara segmentação regional.' },
  { label: 'Cidade / bairro', helper: 'Agenda entrega local e hora.' },
  { label: 'Produtor ou clinica?', helper: 'Mostra hectares e viveiros quando necessário.' },
  { label: 'Serviços disponíveis', helper: 'Clinica e barbearia compartilham catálogo e slots.' },
] as const;

const channelCards = [
  {
    title: 'Chat WhatsApp',
    description:
      'Inbox operacional com fila, Evolution e controles rápidos para cada lead.',
    meta: 'Prioriza atendimento humano + IA',
    action: 'Abrir WhatsApp',
  },
  {
    title: 'Automações',
    description:
      'Builder visual que deixa claro: trigger → condição → ação → destino final.',
    meta: 'Fluxos com IA e workers',
    action: 'Criar automação',
  },
] as const;

const integrations = ['Instagram', 'Facebook', 'YouTube', 'Gmail'] as const;

export function HomePage() {
  return (
    <div className="home-shell">
      <header className="home-header">
        <div className="home-brand">
          <div className="home-brand-mark">LC</div>
          <div>
            <strong>LinkDeCadastro</strong>
            <p>Workspace V2</p>
          </div>
        </div>

        <nav className="home-nav" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="home-actions">
          <Link className="home-panel-link" href="/login">
            Acessar workspace
          </Link>
          <button type="button" className="home-ghost-button">
            Solicitar demo
          </button>
        </div>
      </header>

      <main className="home-body">
        <section className="home-hero hero-card">
          <div className="hero-copy">
            <FadeIn delay={0.04}>
              <p className="eyebrow">Workspace de automações</p>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h1>
                Transforme cliques em sucesso absoluto, com eventos, formulários e chat
                operando em um único console.
              </h1>
            </FadeIn>

            <FadeIn delay={0.12}>
              <p>
                A landing page traz a mesma experiência White Paper do painel: fundo branco,
                cards cinza e hovers púrpura. O Zyr orienta as prioridades, as automações e o
                WhatsApp tocam em segundo plano.
              </p>
            </FadeIn>

            <div className="hero-cta">
              <Link className="home-primary-cta" href="/dashboard">
                Começar gratuitamente
              </Link>
              <Link className="home-secondary-cta" href="/events">
                Ver planos
              </Link>
            </div>

            <StaggerGroup className="hero-stats" delayChildren={0.08} staggerChildren={0.04}>
              {heroStats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="stat-card">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <FadeIn className="hero-panel" delay={0.18}>
            <div className="hero-panel-head">
              <span>Dashboard prioriza eventos</span>
              <span className="badge badge-active">Foco eventos</span>
            </div>
            <p>
              O console leva seu cliente direto ao evento ou fluxo que precisa de ação agora.
              O Zyr destaca o que está acontecendo e o próximo passo.
            </p>
            <div className="hero-panel-body">
              <div>
                <strong>{eventHighlights[0].title}</strong>
                <p>{eventHighlights[0].focus}</p>
              </div>
              <div>
                <strong>Próximo passo</strong>
                <p>{eventHighlights[0].nextStep}</p>
              </div>
              <div className="hero-panel-meta">
                <span>{eventHighlights[0].participants}</span>
                <span>{eventHighlights[0].status}</span>
              </div>
            </div>
            <ZyrHint
              title="Zyr orienta o foco"
              description="Agenda o que precisa de ação hoje e evita que o operador perca eventos em execução."
              tips={['Mostre o evento vivo no topo', 'Coloque o próximo passo em evidencia', 'Conecte o WhatsApp com o evento']}
              className="hero-zyr"
            />
          </FadeIn>
        </section>

        <section className="home-section home-events">
          <div className="section-head">
            <span className="eyebrow">Eventos</span>
            <h2>Dashboard prioriza a exibição de eventos com sinais fortes</h2>
            <p>
              Os cards destacam status, intenções e próximos passos. O objetivo é deixar claro o
              que tocar primeiro e o que precisa de automação.
            </p>
          </div>

          <StaggerGroup className="event-grid" delayChildren={0.08} staggerChildren={0.04}>
            {eventHighlights.map((event) => (
              <StaggerItem key={event.title}>
                <article className="event-card">
                  <div className="card-head">
                    <span className="badge badge-active">{event.status}</span>
                    <strong>{event.title}</strong>
                  </div>
                  <p>{event.focus}</p>
                  <div className="card-meta">
                    <span>{event.participants}</span>
                    <span>{event.nextStep}</span>
                  </div>
                </article>
              </StaggerItem>
            ))}

            <StaggerItem>
              <ZyrEmptyState
                title="Zyr aguarda seu próximo evento"
                description="Quando tudo estiver configurado, esse card vira destaque principal do dashboard."
                action={<Link href="/events">Criar evento agora</Link>}
              />
            </StaggerItem>
          </StaggerGroup>
        </section>

        <section className="home-section home-forms">
          <div className="section-head">
            <span className="eyebrow">Formulários</span>
            <h2>Campos editáveis que se moldam ao cliente (produtor, clínica ou barbearia)</h2>
            <p>
              O builder permite montar formulários públicos com condições específicas e slots
              sincronizados com a agenda.
            </p>
          </div>

          <div className="form-grid">
            <article className="form-card">
              <div className="card-head">
                <span className="eyebrow">Campos essenciais</span>
                <strong>Seu formulário vivo</strong>
              </div>
              <div className="form-fields">
                {formFields.map((field) => (
                  <div key={field.label} className="form-field">
                    <strong>{field.label}</strong>
                    <p>{field.helper}</p>
                  </div>
                ))}
              </div>
              <div className="form-card-actions">
                <button type="button">Configurar formulário</button>
                <span className="pill pill-ghost">Compartilhe links no WhatsApp</span>
              </div>
            </article>

            <article className="form-card form-card-secondary">
              <ZyrErrorState
                title="Zyr detecta campos não tributados"
                description="Campos condicionais como hectares e viveiros só aparecem quando o cliente marca o tipo certo."
                action={<Link href="/form">Editar builder</Link>}
              />
            </article>
          </div>
        </section>

        <section className="home-section home-channel">
          <div className="section-head">
            <span className="eyebrow">Canal WhatsApp + automações</span>
            <h2>Chat, automações e integrações orquestram ações em tempo real</h2>
            <p>
              O dashboard conecta o chat, as automações e as integrações em um só fluxo. A cada
              toque o operador entende o que foi entregue e o que está em execução.
            </p>
          </div>

          <StaggerGroup className="channel-grid" delayChildren={0.08} staggerChildren={0.04}>
            {channelCards.map((card) => (
              <StaggerItem key={card.title}>
                <article className="channel-card">
                  <div className="card-head">
                    <strong>{card.title}</strong>
                    <span className="badge badge-active">{card.meta}</span>
                  </div>
                  <p>{card.description}</p>
                  <div className="channel-card-actions">
                    <button type="button">{card.action}</button>
                    <span className="pill pill-ghost">Evolution ready</span>
                  </div>
                </article>
              </StaggerItem>
            ))}

            <StaggerItem>
              <article className="channel-card integrations-card">
                <div className="card-head">
                  <strong>Integrações</strong>
                  <span className="badge badge-draft">Multi canal</span>
                </div>
                <p>
                  Instagram, Facebook, YouTube e Gmail conectados com automações e WhatsApp para
                  compartilhar campanhas e recursos.
                </p>
                <div className="integration-tags">
                  {integrations.map((integration) => (
                    <span key={integration} className="pill pill-ghost">
                      {integration}
                    </span>
                  ))}
                </div>
                <div className="channel-card-actions">
                  <button type="button">Sincronizar agora</button>
                  <span className="pill">Dados instantâneos</span>
                </div>
                <ZyrHint
                  title="Zyr garante contexto de integração"
                  description="Cada canal precisa mostrar status e próximo passo sem exigir leitura de log."
                  tips={['Status visível', 'Último sync claro', 'Acione automações específicas']}
                  className="channel-zyr"
                />
              </article>
            </StaggerItem>
          </StaggerGroup>
        </section>
      </main>
    </div>
  );
}
