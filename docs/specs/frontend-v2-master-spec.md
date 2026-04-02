# Frontend V2 Master Spec

## Status

Draft aprovado para execução.

## Objetivo

Construir o frontend V2 do Link de Cadastro com foco em:

- clareza de domínio;
- alta evolutividade;
- integração limpa com a API V2;
- suporte natural ao core do produto e ao módulo de atendimento.

## Responsabilidades do frontend

- autenticação e sessão do usuário;
- navegação pública;
- navegação autenticada;
- área administrativa;
- atendimento/chat;
- gestão de cursos, eventos e inscrições;
- consumo de uploads do `S3` por URLs públicas ou assinadas;
- exibição de estados assíncronos vindos da fila/workers.

## O que o frontend não deve fazer

- carregar regra de negócio de alocação de turma;
- decidir lógica de roteamento de agentes;
- derivar estado de conversa a partir de documentos brutos;
- montar payloads acoplados à estrutura interna do banco;
- assumir que chat e core compartilham o mesmo storage ou o mesmo ciclo de latência.

## Arquitetura de frontend recomendada

- `Next.js`
- `React`
- `TypeScript`
- `app router`
- `state server-driven`
- `camada de client SDK por domínio`
- `componentes compartilhados mínimos`
- `design system incremental`

## Fatias de domínio no frontend

- `auth`
- `me`
- `courses`
- `events`
- `registrations`
- `crm`
- `notifications`
- `chat`
- `agents`
- `media`

## Estrutura recomendada

```text
src/
  app/
  domains/
    auth/
    me/
    courses/
    events/
    registrations/
    crm/
    notifications/
    chat/
    agents/
    media/
  shared/
    ui/
    lib/
    hooks/
    types/
```

## Regras de integração com API V2

1. Cada domínio terá um client próprio.
2. DTOs do frontend devem espelhar contratos públicos da API, não entidades internas.
3. Uploads devem usar fluxo preparado para `S3`.
4. Chat deve tratar listas, detalhes, mensagens e insights como domínios separados.
5. Tudo que for long-running deve prever polling, refresh ou eventos.

## Áreas da aplicação

### Pública

- home;
- catálogo;
- landing pages de curso/evento;
- login e registro;
- compartilhamento.

### Usuário autenticado

- perfil;
- meus cursos;
- progresso;
- minhas inscrições;
- notificações.

### Admin

- dashboard;
- cursos;
- eventos;
- inscrições;
- CRM;
- usuários;
- uploads;
- atendimento;
- agentes.

## Qualidade exigida

- acessibilidade básica desde o início;
- responsividade real;
- tratamento explícito de erro, loading e empty state;
- componentes orientados a caso de uso;
- telemetria preparada para fluxos críticos.

## Estratégia de entrega

1. fundação de layout, autenticação e shell;
2. domínios core: cursos, eventos, inscrições e perfil;
3. backoffice admin;
4. chat e atendimento;
5. agentes, copilot e automações.
