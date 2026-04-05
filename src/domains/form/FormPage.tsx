'use client';

import { useState } from 'react';
import { CheckCircle2, GripVertical, Smartphone } from 'lucide-react';

const modeFields: Record<'evento' | 'servico', string[]> = {
  evento: ['Nome', 'CPF', 'WhatsApp', 'CEP', 'Estado', 'Cidade', 'Hectares', 'Viveiros'],
  servico: ['Nome', 'WhatsApp', 'Serviço', 'Horário', 'Profissional'],
};

const templateNotes: Record<'evento' | 'servico', string> = {
  evento: 'Formulário de evento com regras condicionais e campos rurais quando necessário.',
  servico: 'Agenda simples para atendimento, clínica, barbearia ou serviço agendado.',
};

export function FormPage() {
  const [mode, setMode] = useState<'evento' | 'servico'>('evento');
  const [enabledFields, setEnabledFields] = useState<Record<string, boolean>>(
    Object.fromEntries(modeFields.evento.map((field) => [field, true])),
  );

  function handleMode(nextMode: 'evento' | 'servico') {
    setMode(nextMode);
    setEnabledFields(Object.fromEntries(modeFields[nextMode].map((field) => [field, true])));
  }

  function toggleField(field: string) {
    setEnabledFields((current) => ({ ...current, [field]: !current[field] }));
  }

  const fields = modeFields[mode];

  return (
    <section className="form-center-page">
      <header className="form-center-hero">
        <div className="form-center-copy">
          <span className="form-center-kicker">Formulários</span>
          <h1>Builder dinâmico para eventos, atendimento e inscrições.</h1>
          <p>
            O mesmo motor pode montar formulário de evento, clínica, barbearia ou serviço sem
            desperdiçar espaço e sem deixar o preview solto.
          </p>
        </div>

        <div className="form-center-switches">
          <button
            className={mode === 'evento' ? 'form-center-mode is-active' : 'form-center-mode'}
            type="button"
            onClick={() => handleMode('evento')}
          >
            Evento
          </button>
          <button
            className={mode === 'servico' ? 'form-center-mode is-active' : 'form-center-mode'}
            type="button"
            onClick={() => handleMode('servico')}
          >
            Serviço
          </button>
        </div>
      </header>

      <section className="form-center-layout">
        <div className="form-center-builder">
          <article className="form-center-panel">
            <div className="form-center-panel-head">
              <div>
                <strong>Campos editáveis</strong>
                <p>{templateNotes[mode]}</p>
              </div>
              <span className="form-center-pill">{fields.length} campos</span>
            </div>

            <div className="form-center-fields">
              {fields.map((field) => (
                <article key={field} className="form-center-field-card">
                  <div className="form-center-field-main">
                    <span className="form-center-drag">
                      <GripVertical size={16} />
                    </span>
                    <div className="form-center-field-copy">
                      <strong>{field}</strong>
                      <small>
                        {field === 'Hectares' || field === 'Viveiros'
                          ? 'Campo condicional para tipos específicos'
                          : 'Campo ativo no formulário publicado'}
                      </small>
                    </div>
                  </div>

                  <div className="form-center-field-actions">
                    {field === 'Hectares' || field === 'Viveiros' ? (
                      <span className="form-center-tag is-warning">Condicional</span>
                    ) : null}
                    <button
                      className={enabledFields[field] ? 'form-center-toggle is-on' : 'form-center-toggle'}
                      type="button"
                      onClick={() => toggleField(field)}
                    >
                      {enabledFields[field] ? 'Ativo' : 'Oculto'}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="form-center-actions">
              <button className="form-center-primary-btn" type="button">
                Salvar formulário
              </button>
              <button className="form-center-secondary-btn" type="button">
                Compartilhar WhatsApp
              </button>
            </div>
          </article>

          <article className="form-center-panel form-center-notes">
            <div className="form-center-panel-head">
              <div>
                <strong>Regras do builder</strong>
                <p>Organização visual para quem monta rápido e revisa melhor.</p>
              </div>
            </div>
            <div className="form-center-checks">
              <div>
                <CheckCircle2 size={16} />
                <span>Nome e WhatsApp no topo do fluxo</span>
              </div>
              <div>
                <CheckCircle2 size={16} />
                <span>Campos condicionais só quando ajudam o contexto</span>
              </div>
              <div>
                <CheckCircle2 size={16} />
                <span>Preview sempre pronto para compartilhamento</span>
              </div>
            </div>
          </article>
        </div>

        <aside className="form-center-preview-column">
          <article className="form-center-preview-shell">
            <div className="form-center-preview-head">
              <div>
                <strong>Preview mobile</strong>
                <p>Leitura pública do formulário compartilhado.</p>
              </div>
              <Smartphone size={18} />
            </div>

            <div className="form-center-phone">
              <div className="form-center-phone-notch" />
              <div className="form-center-phone-body">
                {fields
                  .filter((field) => enabledFields[field])
                  .map((field) => (
                    <label key={field} className="form-center-preview-field">
                      <span>{field}</span>
                      <div className="form-center-preview-input" />
                    </label>
                  ))}

                <button className="form-center-submit-btn" type="button">
                  Finalizar inscrição
                </button>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </section>
  );
}
