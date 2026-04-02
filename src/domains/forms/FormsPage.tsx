'use client';

import { useState } from 'react';

import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';
import { ZyrEmptyState, ZyrHint } from '@/shared/ui/zyr/ZyrStates';

type FieldDraft = {
  id: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'phone'
    | 'cpf'
    | 'date'
    | 'cep'
    | 'state'
    | 'city'
    | 'district'
    | 'select'
    | 'service'
    | 'timeslot'
    | 'number';
  required: boolean;
  conditional?: string;
};

const eventFields: FieldDraft[] = [
  { id: 'name', label: 'Nome completo', type: 'text', required: true },
  { id: 'cpf', label: 'CPF', type: 'cpf', required: true },
  { id: 'birthDate', label: 'Data de nascimento', type: 'date', required: true },
  { id: 'whatsapp', label: 'Numero de WhatsApp', type: 'phone', required: true },
  { id: 'cep', label: 'CEP', type: 'cep', required: true },
  { id: 'state', label: 'Estado', type: 'state', required: true },
  { id: 'city', label: 'Cidade', type: 'city', required: true },
  { id: 'district', label: 'Bairro', type: 'district', required: false },
  { id: 'participantType', label: 'Se e alguma coisa', type: 'select', required: true },
  {
    id: 'waterArea',
    label: 'Quantos hectares de lamina dagua tem',
    type: 'number',
    required: false,
    conditional: 'Mostrar somente se participante = PRODUTOR',
  },
  {
    id: 'ponds',
    label: 'Quantos viveiros possui',
    type: 'number',
    required: false,
    conditional: 'Mostrar somente se participante = PRODUTOR',
  },
];

const templates = [
  {
    id: 'rural',
    title: 'Evento rural',
    description: 'CPF, geografia, perfil e perguntas condicionais para produtor.',
  },
  {
    id: 'service',
    title: 'Clinica ou barbearia',
    description: 'Nome, WhatsApp, servicos disponiveis e horario.',
  },
  {
    id: 'therapy',
    title: 'Clinica de psicologia',
    description: 'Modelo generico de atendimento com triagem e agenda.',
  },
] as const;

const serviceCatalog = ['Corte + barba', 'Consulta inicial', 'Sessao de psicologia', 'Retorno'];
const slotOptions = ['08:00', '09:30', '11:00', '14:00', '16:30'];

export function FormsPage() {
  const [title, setTitle] = useState('Inscricao principal de evento e atendimento');
  const [goal, setGoal] = useState(
    'Montar formularios genericos para evento, atendimento, clinica ou servicos com regras condicionais e agenda.',
  );
  const [fields, setFields] = useState<FieldDraft[]>(eventFields);
  const [message, setMessage] = useState('Core recomendado: PostgreSQL com JSONB para campos dinamicos.');
  const [activeTemplate, setActiveTemplate] = useState('rural');
  const [serviceMode, setServiceMode] = useState(false);

  function updateField(index: number, patch: Partial<FieldDraft>) {
    setFields((current) =>
      current.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...patch } : field)),
    );
  }

  function applyTemplate(templateId: string) {
    setActiveTemplate(templateId);

    if (templateId === 'service') {
      setTitle('Agendamento de servicos e atendimento');
      setGoal('Permitir que o cliente compartilhe um formulario, selecione servico e reserve horario.');
      setFields([
        { id: 'name', label: 'Nome', type: 'text', required: true },
        { id: 'whatsapp', label: 'Numero de WhatsApp', type: 'phone', required: true },
        { id: 'service', label: 'Servico desejado', type: 'service', required: true },
        { id: 'slot', label: 'Horario disponivel', type: 'timeslot', required: true },
        { id: 'notes', label: 'Observacoes', type: 'text', required: false },
      ]);
      setServiceMode(true);
      setMessage('Zyr entende este modo como fluxo de agenda e servico.');
      return;
    }

    if (templateId === 'therapy') {
      setTitle('Formulario generico de clinica de psicologia');
      setGoal('Triagem leve com dados essenciais, motivo do atendimento e disponibilidade.');
      setFields([
        { id: 'name', label: 'Nome completo', type: 'text', required: true },
        { id: 'whatsapp', label: 'Numero de WhatsApp', type: 'phone', required: true },
        { id: 'email', label: 'Email', type: 'email', required: false },
        { id: 'reason', label: 'Motivo do atendimento', type: 'text', required: true },
        { id: 'availability', label: 'Melhor horario', type: 'timeslot', required: true },
      ]);
      setServiceMode(true);
      setMessage('Zyr ajuda a organizar uma triagem simples e confiavel.');
      return;
    }

    setTitle('Inscricao principal de evento e atendimento');
    setGoal(
      'Montar formularios genericos para evento, atendimento, clinica ou servicos com regras condicionais e agenda.',
    );
    setFields(eventFields);
    setServiceMode(false);
    setMessage('Core recomendado: PostgreSQL com JSONB para campos dinamicos.');
  }

  return (
    <section className="wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.04}>
            <p className="eyebrow">Forms</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2>Builder flexivel para evento, servico e atendimento.</h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p>
              O cliente precisa montar um formulario de evento rural, uma agenda de barbearia ou
              um intake de clinica sem trocar de produto e sem pedir codigo.
            </p>
          </FadeIn>
          <div className="quick-actions" style={{ marginTop: 16 }}>
            <div className="quick-action">
              <span className="quick-action-label">Campos editaveis</span>
              <span className="quick-action-meta">Nome, CPF, data, WhatsApp, CEP e outros campos.</span>
            </div>
            <div className="quick-action">
              <span className="quick-action-label">Condicoes</span>
              <span className="quick-action-meta">Mostrar hectares e viveiros somente para produtor.</span>
            </div>
            <div className="quick-action">
              <span className="quick-action-label">Servicos + agenda</span>
              <span className="quick-action-meta">Clinica e barbearia com servico e horario.</span>
            </div>
            <div className="quick-action">
              <span className="quick-action-label">Zyr</span>
              <span className="quick-action-meta">Ajuda a montar perguntas e regras sem ruido.</span>
            </div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <div className="pill">{message}</div>
          <ZyrHint
            title="Zyr ajuda a montar perguntas que mudam com o contexto"
            description="Ele deve aparecer quando o operador estiver construindo formularios mais complexos, principalmente com condicoes e agenda."
            tips={[
              'use o mesmo motor para evento, clinica e barbearia',
              'deixe o campo de servico separado do horario',
              'grave o payload completo e os valores pesquisaveis',
            ]}
          />
          <div className="panel panel-accent">
            <strong>Decisao de dados</strong>
            <p>
              Formularios e agendamentos devem viver no PostgreSQL core. Mongo continua reservado
              ao dominio de chat.
            </p>
          </div>
        </div>
      </div>

      <div className="form-builder-grid" style={{ marginTop: 18 }}>
        <article className="panel form-card">
          <strong>Builder</strong>
          <div className="stack form-grid" style={{ marginTop: 14 }}>
            <div className="field-group">
              <span className="field-label">Templates iniciais</span>
              <div className="field-chip-grid">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    className={activeTemplate === template.id ? 'pill' : 'pill pill-ghost'}
                    onClick={() => applyTemplate(template.id)}
                  >
                    {template.title}
                  </button>
                ))}
              </div>
            </div>

            <label className="field-block">
              <span>Titulo do formulario</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label className="field-block">
              <span>Objetivo</span>
              <textarea value={goal} onChange={(event) => setGoal(event.target.value)} rows={4} />
            </label>

            <StaggerGroup className="stack" delayChildren={0.06} staggerChildren={0.05}>
              {fields.map((field, index) => (
                <StaggerItem key={field.id}>
                  <div className="builder-step">
                    <div className="panel-head">
                      <strong>{field.id}</strong>
                      <span className={field.required ? 'badge badge-active' : 'badge badge-draft'}>
                        {field.required ? 'Obrigatorio' : 'Opcional'}
                      </span>
                    </div>
                    <input
                      value={field.label}
                      onChange={(event) => updateField(index, { label: event.target.value })}
                    />
                    <div className="field-row">
                      <select
                        value={field.type}
                        onChange={(event) =>
                          updateField(index, {
                            type: event.target.value as FieldDraft['type'],
                          })
                        }
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="cpf">CPF</option>
                        <option value="date">Data</option>
                        <option value="cep">CEP</option>
                        <option value="state">Estado</option>
                        <option value="city">Cidade</option>
                        <option value="district">Bairro</option>
                        <option value="select">Select</option>
                        <option value="service">Servico</option>
                        <option value="timeslot">Horario</option>
                        <option value="number">Numero</option>
                      </select>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(event) =>
                            updateField(index, { required: event.target.checked })
                          }
                        />
                        Obrigatorio
                      </label>
                    </div>
                    {field.conditional ? <small>{field.conditional}</small> : null}
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <div className="summary-row">
              <button type="button" onClick={() => setMessage('Rascunho salvo para revisao do time.')}>Salvar rascunho</button>
              <button type="button" onClick={() => setMessage('Link de revisao pronto para compartilhamento.')}>Compartilhar preview</button>
            </div>

            <div className="panel">
              <strong>Condicao ativa</strong>
              <p>
                Se o campo <strong>Se e alguma coisa</strong> for <strong>PRODUTOR</strong>,
                exibir <strong>hectares de lamina dagua</strong> e <strong>quantidade de viveiros</strong>.
              </p>
            </div>

            {serviceMode ? (
              <div className="panel">
                <strong>Servicos e horarios</strong>
                <div className="field-chip-grid">
                  {serviceCatalog.map((service) => (
                    <span key={service} className="pill pill-ghost">
                      {service}
                    </span>
                  ))}
                </div>
                <div className="field-chip-grid" style={{ marginTop: 10 }}>
                  {slotOptions.map((slot) => (
                    <span key={slot} className="pill">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <ZyrEmptyState
                title="Zyr deixaria a agenda desligada por enquanto"
                description="Quando o template estiver em modo de evento, o builder pode focar em dados do participante e regras condicionais."
              />
            )}
          </div>
        </article>

        <div className="stack">
          <article className="panel">
            <strong>Preview publico</strong>
            <p>{title}</p>
            <p className="muted">{goal}</p>
            <div className="stack form-public-preview">
              {fields.map((field) => (
                <div key={field.id} className="builder-step">
                  <strong>{field.label}</strong>
                  <small>
                    {field.type} | {field.required ? 'obrigatorio' : 'opcional'}
                  </small>
                  {field.conditional ? <small>{field.conditional}</small> : null}
                </div>
              ))}
            </div>

            {serviceMode ? (
              <div className="panel stack-lift">
                <strong>Escolha de servicos</strong>
                <div className="field-chip-grid">
                  {serviceCatalog.map((service) => (
                    <span key={service} className="pill pill-ghost">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <article className="panel">
            <strong>Destino da submissao</strong>
            <p className="muted">
              O envio pode gerar lead, iniciar atendimento no WhatsApp, reservar horario,
              alimentar CRM ou acionar automacao conforme o template.
            </p>
          </article>

          <article className="panel panel-accent">
            <strong>Casos que precisam caber</strong>
            <p>
              Evento rural, clinica de atendimento, barbearia e psicologia precisam ser apenas
              variacoes do mesmo builder.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
