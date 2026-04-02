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
5. `front-foundation-agent`
6. `front-core-experience-agent`
7. `front-admin-agent`
8. `front-chat-agent`
9. `front-integration-agent`
10. `front-devops-agent`
11. `front-security-agent`
12. `front-quality-agent`
13. `front-mobile-uiux-agent`
14. `front-desktop-uiux-agent`

## Regra principal

Nenhum agente do front deve introduzir acoplamento indevido ao backend legado ou aos bancos. Toda integração deve passar por contratos públicos da API V2.
