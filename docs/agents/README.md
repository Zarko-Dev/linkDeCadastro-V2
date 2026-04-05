# Frontend V2 Agent System

## Objetivo

Organizar a construção do frontend V2 por agentes especializados, com papéis claros e handoff previsível.

## Agentes ativos

- `front-architecture-agent.md`
- `front-product-agent.md`
- `front-chat-agent.md`
- `front-security-agent.md`
- `front-shell-agent.md`
- `front-design-system-agent.md`
- `front-screen-agent.md`
- `front-foundation-agent.md`
- `front-core-experience-agent.md`
- `front-admin-agent.md`
- `front-integration-agent.md`
- `front-devops-agent.md`
- `front-quality-agent.md`
- `front-orchestrator-agent.md`
- `front-mobile-uiux-agent.md`
- `front-desktop-uiux-agent.md`

## Ordem recomendada

1. `front-orchestrator-agent`
2. `front-architecture-agent`
3. `front-shell-agent`
4. `front-design-system-agent`
5. `front-screen-agent`
6. `front-foundation-agent`
7. `front-core-experience-agent`
8. `front-admin-agent`
9. `front-chat-agent`
10. `front-integration-agent`
11. `front-devops-agent`
12. `front-security-agent`
13. `front-quality-agent`
14. `front-mobile-uiux-agent`
15. `front-desktop-uiux-agent`

## Regra principal

Nenhum agente do front deve introduzir acoplamento indevido ao backend legado ou aos bancos. Toda integração deve passar por contratos públicos da API V2.
