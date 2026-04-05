'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';

import zyrDone from '../../../assets/zyr_concluide.png';
import zyrTips from '../../../assets/zyr_tips.png';
import zyrConfused from '../../../assets/zyr_confused.png';
import zyrLogin from '../../../assets/zyr_login.png';
import brandLogo from '../../../assets/Logo.png';

type NavigationItem = {
  label: string;
  href: string;
  active?: boolean;
};

const navigation = [
  { label: 'Home', href: '#inicio', active: true },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Formularios', href: '#formularios' },
  { label: 'Agentes', href: '#agentes' },
  { label: 'Login', href: '/login' },
] satisfies readonly NavigationItem[];

const showcase = [
  {
    title: 'Eventos',
    description: 'Dashboard com foco no que esta ao vivo e no proximo passo operacional.',
    image: zyrTips,
  },
  {
    title: 'Formularios',
    description: 'Builder flexivel para produtor, clinica, barbearia e agendas de servico.',
    image: zyrConfused,
  },
  {
    title: 'WhatsApp + IA',
    description: 'Atendimento, automacoes e agentes em um unico fluxo de acao.',
    image: zyrLogin,
  },
] as const;

export function HomePage() {
  return (
    <div className="zyro-home-shell">
      <main className="zyro-home-frame">
        <header className="zyro-home-topbar">
          <Link href="/" className="zyro-home-brand">
            <Image src={brandLogo} alt="Logo ZYRO" className="brand-logo-image brand-logo-image-home-hero" priority />
          </Link>

          <nav className="zyro-home-nav" aria-label="Navegacao principal">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={item.active ? 'is-active' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link className="zyro-home-login" href="/login">
            Fazer login
          </Link>
        </header>

        <section className="zyro-home-hero" id="inicio">
          <div className="zyro-home-copy">
            <FadeIn delay={0.04}>
              <span className="zyro-home-kicker">Plataforma operacional com IA</span>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h1>
                ZYRO
                <span> EVENT FLOW</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p>
                Capte leads, publique formularios inteligentes, priorize eventos e transforme o
                WhatsApp em um canal de acao com agentes e automacoes.
              </p>
            </FadeIn>

            <FadeIn delay={0.16}>
              <div className="zyro-home-actions">
                <Link className="zyro-home-primary" href="/login">
                  Entrar agora
                </Link>
                <a className="zyro-home-arrow" href="#visao-geral" aria-label="Ir para visao geral">
                  <ArrowRight size={18} />
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="zyro-home-ring">
                <span>events</span>
                <strong>24/7</strong>
                <span>agents</span>
              </div>
            </FadeIn>
          </div>

          <FadeIn className="zyro-home-visual" delay={0.16}>
            <div className="zyro-home-visual-card">
              <Image
                src={zyrDone}
                alt="Mascote Zyr como destaque principal da home"
                className="zyro-home-visual-image"
                priority
              />
            </div>
          </FadeIn>
        </section>

        <section className="zyro-home-lower" id="visao-geral">
          <article className="zyro-home-story">
            <div className="zyro-home-story-copy">
              <span className="eyebrow">Visao geral</span>
              <h2>Uma base unica para captar, atender e agir todos os dias.</h2>
              <p>
                O Zyr ajuda a reduzir o atrito entre evento, formulario, inbox, automacao e
                decisao operacional. Tudo fica mais simples, visivel e pronto para escalar.
              </p>
            </div>

            <div className="zyro-home-story-links">
              <span>Eventos ao vivo</span>
              <span>Formularios editaveis</span>
              <span>Inbox WhatsApp</span>
            </div>
          </article>

          <StaggerGroup className="zyro-home-showcase" delayChildren={0.08} staggerChildren={0.05}>
            {showcase.map((item) => (
              <StaggerItem key={item.title}>
                <article className="zyro-home-showcase-card" id={item.title.toLowerCase().replace(/\s+\+\s+|\s+/g, '-')}>
                  <div className="zyro-home-showcase-image-wrap">
                    <Image
                      src={item.image}
                      alt={`Ilustracao do modulo ${item.title}`}
                      className="zyro-home-showcase-image"
                    />
                  </div>
                  <div className="zyro-home-showcase-copy">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      </main>
    </div>
  );
}
