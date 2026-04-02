'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { AnimatedPage, FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';

type AppShellProps = {
  children: ReactNode;
};

const links: ReadonlyArray<{ to: Route; label: string }> = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/form', label: 'Formulario' },
  { to: '/chat', label: 'WhatsApp' },
  { to: '/agents', label: 'Agentes' },
  { to: '/automations', label: 'Automacoes' },
  { to: '/integrations', label: 'Integracoes' },
  { to: '/login', label: 'Login' },
  { to: '/courses', label: 'Cursos' },
  { to: '/events', label: 'Eventos' },
  { to: '/admin/users', label: 'Usuarios' },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell product-shell">
      <FadeIn className="product-topbar" delay={0.04}>
        <div className="brand-lockup">
          <div className="brand-mark">LC</div>
          <div className="brand-copy">
            <p className="eyebrow">Link de Cadastro V2</p>
            <strong>Automation Studio</strong>
            <small className="muted">Premium workspace for AI, forms and WhatsApp</small>
          </div>
        </div>

        <StaggerGroup className="product-nav" delayChildren={0.08} staggerChildren={0.04}>
          {links.map((link) => (
            <StaggerItem key={link.to}>
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link
                  className={pathname === link.to ? 'product-nav-link active' : 'product-nav-link'}
                  href={link.to}
                >
                  {link.label}
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="topbar-actions">
          <span className="pill">Operational shell</span>
          <span className="pill pill-ghost">AI ready</span>
          <Link className="topbar-cta" href="/dashboard">
            Abrir cockpit
          </Link>
        </div>
      </FadeIn>

      <main className="content">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
    </div>
  );
}
