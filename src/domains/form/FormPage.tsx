'use client';

import { useState } from 'react';

import { FadeIn } from '@/shared/ui/motion/MotionPrimitives';
import { ZyrHint } from '@/shared/ui/zyr/ZyrStates';

const serviceCatalog = ['Corte + barba', 'Consulta inicial', 'Sessao de psicologia'];
const slots = ['08:00', '09:30', '11:00', '14:00', '16:30'];

export function FormPage() {
  const [mode, setMode] = useState<'event' | 'service'>('event');

  return (
    <section className="form-layout hero-surface wide-page">
      <div className="form-intro">
        <FadeIn delay={0.04}>
          <p className="eyebrow">Formulario publico</p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2>
            {mode === 'event'
              ? 'Inscricao para evento com leitura imediata.'
              : 'Agendamento simples e mobile-first para servicos.'}
          </h2>
        </FadeIn>
        <FadeIn delay={0.12}>
          <p>
            A experiencia publica precisa ser clara, compacta e confortavel no celular. O link
            compartilha a entrada certa sem esconder o proximo passo.
          </p>
        </FadeIn>
      </div>

      <div className="summary-row">
        <button
          type="button"
          className={mode === 'event' ? 'pill' : 'pill pill-ghost'}
          onClick={() => setMode('event')}
        >
          Evento
        </button>
        <button
          type="button"
          className={mode === 'service' ? 'pill' : 'pill pill-ghost'}
          onClick={() => setMode('service')}
        >
          Servico
        </button>
      </div>

      <div className="two-col">
        <article className="panel form-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">{mode === 'event' ? 'Growth Summit V2' : 'Agenda inteligente'}</span>
              <strong>{mode === 'event' ? 'Confirme sua inscricao' : 'Escolha servico e horario'}</strong>
            </div>
            <span className="agent-status agent-active">Publico</span>
          </div>

          <form className="stack form-grid">
            <div className="two-col">
              <label className="field-block">
                <span>Nome completo</span>
                <input placeholder="Ex: Alex Silva" />
              </label>
              <label className="field-block">
                <span>{mode === 'event' ? 'CPF' : 'Email opcional'}</span>
                <input placeholder={mode === 'event' ? '000.000.000-00' : 'voce@empresa.com'} />
              </label>
            </div>

            <div className="two-col">
              <label className="field-block">
                <span>WhatsApp</span>
                <input placeholder="+55 (11) 99999-9999" />
              </label>
              <label className="field-block">
                <span>{mode === 'event' ? 'Cidade' : 'Profissional opcional'}</span>
                <input placeholder={mode === 'event' ? 'Sao Paulo' : 'Escolha depois'} />
              </label>
            </div>

            {mode === 'event' ? (
              <>
                <div className="two-col">
                  <label className="field-block">
                    <span>Estado</span>
                    <input placeholder="SP" />
                  </label>
                  <label className="field-block">
                    <span>Se e alguma coisa</span>
                    <select defaultValue="Produtor">
                      <option>Produtor</option>
                      <option>Estudante</option>
                      <option>Professor</option>
                      <option>Pesquisador</option>
                    </select>
                  </label>
                </div>
                <div className="two-col">
                  <label className="field-block">
                    <span>Quantos hectares de lamina dagua tem</span>
                    <input placeholder="12" />
                  </label>
                  <label className="field-block">
                    <span>Quantos viveiros possui</span>
                    <input placeholder="4" />
                  </label>
                </div>
              </>
            ) : (
              <>
                <label className="field-block">
                  <span>Servicos disponiveis</span>
                  <div className="field-chip-grid">
                    {serviceCatalog.map((service) => (
                      <span key={service} className="pill pill-ghost">
                        {service}
                      </span>
                    ))}
                  </div>
                </label>
                <label className="field-block">
                  <span>Horarios disponiveis</span>
                  <div className="field-chip-grid">
                    {slots.map((slot) => (
                      <span key={slot} className="pill">
                        {slot}
                      </span>
                    ))}
                  </div>
                </label>
              </>
            )}

            <div className="helper-panel" role="status" aria-live="polite">
              <strong>
                {mode === 'event'
                  ? 'Ao confirmar, voce entra na fila oficial do evento.'
                  : 'Ao confirmar, o sistema reserva um horario valido.'}
              </strong>
              <p>
                O mesmo motor precisa atender evento, clinica, barbearia e atendimento generico sem
                mudar a plataforma.
              </p>
            </div>

            <button type="button">
              {mode === 'event' ? 'Confirmar minha inscricao' : 'Confirmar meu horario'}
            </button>
          </form>
        </article>

        <article className="panel preview-panel">
          <strong>Leitura do builder</strong>
          <p>
            Esse formulario publico nasce do mesmo motor do painel interno, com regras,
            servicos e agenda definidos pelo workspace.
          </p>

          <ZyrHint
            title="Zyr ajuda a organizar a ordem dos campos"
            description="Quando o formulario fica mais longo, o Zyr pode lembrar a melhor sequencia para reduzir friccao no celular e aumentar a taxa de conclusao."
            tips={[
              'mantenha o nome e o WhatsApp no topo',
              'mostre condicoes apenas quando elas ajudam a decidir',
              'deixe a confirmacao visivel antes do envio',
            ]}
          />

          <div className="mobile-preview">
            <div className="mobile-preview-top">
              <span className="eyebrow">Preview mobile</span>
              <span className="badge badge-active">Share ready</span>
            </div>
            <h3>{mode === 'event' ? 'Growth Summit V2' : 'Agenda Growth Ops'}</h3>
            <p>
              {mode === 'event'
                ? 'Formulario para evento com dados essenciais e perguntas condicionais.'
                : 'Formulario de servico com catalogo, horarios e confirmacao.'}
            </p>
            <div className="preview-fields">
              {[
                'Nome',
                'WhatsApp',
                mode === 'event' ? 'CPF' : 'Servico',
                mode === 'event' ? 'Cidade' : 'Horario',
              ].map((field) => (
                <div key={field} className="preview-field">
                  <span>{field}</span>
                  <div className="preview-line" />
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
