'use client';

import Link from 'next/link';

import {
  FadeIn,
  StaggerGroup,
  StaggerItem,
} from '@/shared/ui/motion/MotionPrimitives';

const plans = [
  {
    label: 'Essencial',
    name: 'Simples',
    price: 'R$ 40',
    cadence: 'por mes',
    tone: 'slate',
    bullets: [
      'Cadastro de leads e inscritos',
      'Gestao de eventos e formularios',
      'Painel administrativo completo',
      'CRM basico com funil visual',
    ],
  },
  {
    label: 'Mais vendido',
    name: 'WhatsApp',
    price: 'R$ 60',
    cadence: 'por mes',
    tone: 'violet',
    bullets: [
      'Tudo do plano Simples',
      'Multiplos numeros de WhatsApp',
      'Transmissoes e atendimento',
      'Sincronizacao de grupos e contatos',
    ],
  },
  {
    label: 'IA ativa',
    name: 'Agentes',
    price: 'R$ 100',
    cadence: 'por mes',
    tone: 'indigo',
    bullets: [
      'Tudo do plano WhatsApp',
      'Agente inteligente configuravel',
      'Atendimento autonomo por numero',
      'Acionamento de automacoes e contexto',
    ],
  },
  {
    label: 'Sob medida',
    name: 'Personalizado',
    price: 'R$ 120',
    cadence: 'por mes',
    tone: 'orange',
    bullets: [
      'Tudo do plano Agentes',
      '2 agentes inclusos',
      'Fluxos personalizados por cliente',
      'Acompanhamento de implantacao',
    ],
  },
] as const;

const showcases = [
  {
    tag: 'Evento ao vivo',
    title: 'Cadastro de produtores',
    description:
      'Landing pages com cadastro publico, turma por municipio e acompanhamento completo do lead.',
    meta: '24 vagas',
  },
  {
    tag: 'Evento ao vivo',
    title: 'Capacitacao do programa',
    description:
      'Cursos e eventos rodando lado a lado, com divulgacao, confirmacao e operacao dentro da mesma plataforma.',
    meta: 'Aberto',
  },
] as const;

const integrations = ['Instagram', 'Facebook', 'YouTube', 'Gmail'] as const;

export function HomePage() {
  return (
    <div className="landing-shell">
      <FadeIn className="landing-topbar-wrap" delay={0.04}>
        <header className="landing-topbar">
          <Link className="landing-brand" href="/">
            <span className="landing-brand-mark">LD</span>
            <span className="landing-brand-text">
              <strong>LinkDe</strong>Cadastro
            </span>
          </Link>

          <nav className="landing-nav" aria-label="Navegacao principal">
            <a href="#inicio">Inicio</a>
            <a href="#solucoes">Solucoes</a>
            <a href="#precos">Precos</a>
            <a href="#suporte">Suporte</a>
            <a href="#contato">Contatos</a>
          </nav>

          <div className="landing-topbar-actions">
            <span className="landing-status">Em breve</span>
            <Link className="landing-panel-link" href="/dashboard">
              Meu painel
            </Link>
          </div>
        </header>
      </FadeIn>

      <main className="landing-main" id="inicio">
        <section className="landing-hero">
          <FadeIn className="landing-copy" delay={0.08}>
            <span className="landing-kicker">Plataforma para profissionais</span>
            <h1>
              Transforme Cliques em
              <span> Sucesso Absoluto.</span>
            </h1>
            <p>
              A LinkDeCadastro automatiza sua captacao de leads, gerencia seus
              eventos e conecta voce diretamente ao seu publico via WhatsApp com
              inteligencia artificial.
            </p>

            <div className="landing-cta-row">
              <Link className="landing-primary-cta" href="/login">
                Comecar gratuitamente
              </Link>
              <a className="landing-secondary-cta" href="#precos">
                Ver planos
              </a>
            </div>
          </FadeIn>

          <FadeIn className="landing-hero-card" delay={0.14}>
            <div className="landing-hero-card-header">
              <span className="landing-dot" />
              <span>Workspace operacional</span>
            </div>

            <div className="landing-command-preview">
              <div className="landing-command-copy">
                <strong>Operacao orientada por agentes</strong>
                <p>
                  Formulario, CRM, WhatsApp, automacoes e integracoes prontos
                  para agir em tempo real.
                </p>
              </div>

              <div className="landing-mini-stats">
                <div>
                  <span>Leads</span>
                  <strong>+248</strong>
                </div>
                <div>
                  <span>Fila</span>
                  <strong>12</strong>
                </div>
                <div>
                  <span>Agentes</span>
                  <strong>06</strong>
                </div>
              </div>
            </div>

            <div className="landing-integrations-strip">
              {integrations.map((integration) => (
                <span key={integration}>{integration}</span>
              ))}
            </div>
          </FadeIn>
        </section>

        <section className="landing-section" id="precos">
          <FadeIn delay={0.12}>
            <div className="landing-section-head">
              <span>Precos</span>
              <h2>Planos para cada etapa do seu crescimento.</h2>
              <p>
                Escolha a estrutura ideal para captacao, vendas no WhatsApp e
                operacao com agentes inteligentes.
              </p>
            </div>
          </FadeIn>

          <StaggerGroup
            className="pricing-grid"
            delayChildren={0.08}
            staggerChildren={0.06}
          >
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <article className={`pricing-card pricing-card-${plan.tone}`}>
                  <div className="pricing-card-head">
                    <span className="pricing-badge">{plan.label}</span>
                    <h3>{plan.name}</h3>
                    <div className="pricing-price">
                      <strong>{plan.price}</strong>
                      <span>{plan.cadence}</span>
                    </div>
                  </div>

                  <ul className="pricing-list">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>

                  <Link className="pricing-cta" href="/login">
                    Escolher plano
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        <section className="landing-section" id="solucoes">
          <FadeIn delay={0.14}>
            <div className="landing-section-head">
              <span>Live & on-demand</span>
              <h2>Eventos & cursos disponiveis</h2>
              <p>
                Sua operacao sai do papel com paginas publicas, formularios e
                jornadas de acompanhamento em uma unica interface.
              </p>
            </div>
          </FadeIn>

          <StaggerGroup
            className="showcase-grid"
            delayChildren={0.1}
            staggerChildren={0.08}
          >
            {showcases.map((item) => (
              <StaggerItem key={item.title}>
                <article className="showcase-card">
                  <div className="showcase-media">
                    <span>{item.tag}</span>
                  </div>
                  <div className="showcase-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="showcase-meta">
                      <small>{item.meta}</small>
                      <Link href="/events">Abrir</Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        <section className="landing-support" id="suporte">
          <FadeIn delay={0.18}>
            <span>Suporte</span>
            <h2>Estrutura pronta para vender, atender e crescer.</h2>
            <p>
              Do plano mais simples ao atendimento com agentes, a plataforma foi
              pensada para acompanhar sua operacao desde a captacao ate a
              conversa com o cliente.
            </p>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}
