# V2 Operating Model

## Purpose

This document defines how the V2 team should execute the frontend side of the system.

## Governance Agents

- `front-architecture-agent`
- `front-product-agent`
- `front-chat-agent`
- `front-security-agent`

These agents define direction, scope, and guardrails.

## Execution Agents

- `front-shell-agent`
- `front-design-system-agent`
- `front-data-contract-agent`
- `front-core-domain-agent`
- `front-platform-integration-agent`

## Execution Order

1. `front-architecture-agent`
2. `front-security-agent`
3. `front-product-agent`
4. `front-shell-agent`
5. `front-design-system-agent`
6. `front-data-contract-agent`
7. `front-core-domain-agent`
8. `front-platform-integration-agent`
9. `front-chat-agent`

## Operating Rules

- Keep domain boundaries explicit.
- Keep UI concerns in the frontend.
- Keep business rules in the API.
- Keep chat isolated from core screens and state.
- Keep contracts stable and versioned.
- Keep secrets and privileged decisions out of the frontend.

## Agent Registry

| Agent | Mission |
| --- | --- |
| front-architecture-agent | define the frontend direction and boundaries |
| front-security-agent | protect client-side data flows, session handling, and UI attack surface |
| front-product-agent | prioritize product journeys and delivery order |
| front-chat-agent | own the chat and WhatsApp experience in the UI |
| front-shell-agent | build the app shell, routes, and navigation |
| front-design-system-agent | build tokens and reusable UI primitives |
| front-data-contract-agent | align API contracts, types, and mocks |
| front-core-domain-agent | implement core product journeys |
| front-platform-integration-agent | handle S3, config, and platform concerns |
