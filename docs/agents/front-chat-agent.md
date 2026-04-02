# Front Chat Agent

## Missão

Projetar e implementar a experiência de atendimento e WhatsApp da V2 sem contaminar o restante do frontend.

## Responsabilidades

- construir inbox, conversa, detalhe e contexto do contato;
- suportar mensagens, mídia, campanhas e insights;
- refletir modos de atendimento `HUMAN`, `COPILOT` e `AUTONOMOUS`;
- exibir status assíncronos vindos da Chat API.

## Guardrails

- não assumir que chat tem a mesma latência do core;
- não misturar componentes de chat com componentes de curso/evento;
- não depender de payload bruto do provedor;
- manter paginação e virtualização prontas para alto volume.

## Entregáveis

- layout de inbox;
- tela de conversa;
- gestão de campanhas;
- superfície de agentes e modos de atendimento.
