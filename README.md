# Link de Cadastro V2 - Frontend

Este repositorio nasce com abordagem spec-driven.

Antes de implementar telas, componentes ou integracoes, usamos os documentos em `docs/` para alinhar:

- visao do produto
- limites do frontend
- contratos esperados da API V2
- principios de arquitetura
- agentes de execucao para desenvolvimento

## Estrutura inicial

- `docs/specs/frontend-v2-master-spec.md`
- `docs/specs/shared-v2-context.md`
- `docs/specs/o-n-on-manifesto.md`
- `docs/security-first-pass.md`
- `docs/deployment/vercel-setup.md`
- `docs/agents/front-architecture-agent.md`
- `docs/agents/front-product-agent.md`
- `docs/agents/front-chat-agent.md`

## Intencao da V2

Construir uma experiencia nova, limpa e desacoplada do legado, com:

- frontend Next.js orientado a dominio
- API V2 como backend oficial
- banco principal do core separado do dominio de WhatsApp
- arquitetura preparada para escala e processamento assincrono

## Principio de sustentabilidade

A V2 segue o conceito `O -> N -> On`:

- `O`: origem clara do dominio
- `N`: entrada disciplinada do novo
- `On`: sistema sustentavel, ligado e preparado para crescer

Manifesto em `docs/specs/o-n-on-manifesto.md`.
