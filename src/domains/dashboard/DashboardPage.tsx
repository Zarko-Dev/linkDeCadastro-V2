'use client';

import Link from 'next/link';
import type { Route } from 'next';
import {
  CalendarRange,
  FolderOpen,
  MessageSquare,
  Shield,
  UsersRound,
  Wrench,
} from 'lucide-react';

import { getStoredUser } from '@/shared/lib/api';

const overviewCards = [
  {
    title: 'Sessao',
    value: 'Autenticacao',
    note: 'Sessao ativa e pronta para uso',
    tone: 'growth',
    icon: Shield,
  },
  {
    title: 'Usuarios',
    value: 'Acessos',
    note: 'Gerencie usuarios e permissoes',
    tone: 'live',
    icon: UsersRound,
  },
  {
    title: 'Cursos',
    value: 'Catalogo',
    note: 'Consulte e edite cursos cadastrados',
    tone: 'accent',
    icon: FolderOpen,
  },
  {
    title: 'Eventos',
    value: 'Agenda',
    note: 'Acompanhe eventos e publicacoes',
    tone: 'live',
    icon: CalendarRange,
  },
  {
    title: 'Chat',
    value: 'Atendimento',
    note: 'Sem mensagens recentes no momento',
    tone: 'neutral',
    icon: MessageSquare,
  },
  {
    title: 'Integracoes',
    value: 'Configuracao',
    note: 'Revise conexoes e parametros do sistema',
    tone: 'neutral',
    icon: Wrench,
  },
] as const;

const shortcuts = [
  { label: 'Usuarios', href: '/users', helper: 'Abrir lista de usuarios' },
  { label: 'Cursos', href: '/courses', helper: 'Abrir catalogo de cursos' },
  { label: 'Eventos', href: '/events', helper: 'Abrir agenda de eventos' },
  { label: 'Agentes', href: '/agents', helper: 'Abrir area de agentes' },
  { label: 'Chat', href: '/chat', helper: 'Abrir inbox do chat' },
] as const;

const statusItems = [
  'Sessao carregada localmente',
  'API disponivel para autenticacao',
  'Aguardando dados operacionais adicionais',
] as const;

export function DashboardPage() {
  const user = getStoredUser();

  return (
    <section className="obsidian-dashboard">
      <section className="obsidian-stage-panel obsidian-overview-panel">
        <div className="obsidian-overview-head">
          <div className="obsidian-overview-copy">
            <h1>Visao Geral</h1>
            <p>Painel inicial com atalhos do sistema e estado atual da sessao.</p>
          </div>

          <Link className="obsidian-overview-cta" href="/login">
            Abrir login
          </Link>
        </div>

        <div className="obsidian-overview-grid">
          {overviewCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="obsidian-overview-card">
                <div className="obsidian-overview-card-head">
                  <div className={`obsidian-overview-icon is-${card.tone}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`obsidian-overview-note is-${card.tone}`}>{card.note}</span>
                </div>

                <div className="obsidian-overview-card-body">
                  <span>{card.title}</span>
                  <strong>{card.value}</strong>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="obsidian-dashboard-card obsidian-chat-panel">
        <div className="obsidian-chat-head">
          <span className="obsidian-panel-label">SESSAO</span>
          <span className="obsidian-chat-badge">{user ? 'Ativa' : 'Indisponivel'}</span>
        </div>

        <div className="obsidian-chat-body">
          <div className="obsidian-chat-bubble">
            <span className="obsidian-chat-dot" />
            <p>
              {user
                ? `${user.name} conectado com perfil ${user.role}.`
                : 'Nenhuma sessao local encontrada.'}
            </p>
          </div>

          <div className="obsidian-chat-input-shell">
            <div className="obsidian-chat-input-bar">
              <span>Atalhos</span>
            </div>
            <div className="summary-row" style={{ marginTop: 12, flexWrap: 'wrap' }}>
              {shortcuts.map((shortcut) => (
                <Link key={shortcut.href} className="pill pill-ghost" href={shortcut.href as Route}>
                  {shortcut.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="obsidian-dashboard-card obsidian-calendar-panel">
        <div className="obsidian-calendar-head">
          <div>
            <span className="obsidian-panel-label">STATUS</span>
            <strong>Resumo do ambiente</strong>
          </div>
          <span className="obsidian-calendar-status">Atual</span>
        </div>

        <div className="obsidian-calendar-grid">
          {statusItems.map((item, index) => (
            <article key={item} className="obsidian-calendar-day">
              <span className="obsidian-calendar-day-number">0{index + 1}</span>
              <small>{item}</small>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
