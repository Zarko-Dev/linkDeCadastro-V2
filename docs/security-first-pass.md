# Security First Pass - Frontend V2

## Estado atual

- o frontend usa apenas `NEXT_PUBLIC_API_URL` no client;
- o contrato de sessao esta alinhado com refresh token em cookie `HttpOnly` e access token de curta duracao no browser;
- o client centraliza retry de refresh para respostas `401`;
- headers de seguranca basicos agora saem pelo `next.config.mjs`;
- o `.env.example` do frontend foi reduzido a variaveis publicas para evitar mistura com segredos.

## Riscos priorizados

### P0

- faltam guards reais de navegacao e estado autenticado nas areas administrativas;
- o frontend ainda depende da API para decidir autorizacao, mas nao expõe esse estado de forma consistente na UI;
- as paginas admin ainda podem nascer sem uma camada padronizada para `401` e `403`.

### P1

- falta telemetria segura para auth e erro de sessao;
- falta politica clara de expiracao visivel ao usuario;
- falta contrato final para upload com feedback de erro e limite por tipo;
- falta revisao anti-XSS nas futuras superficies ricas de CRM, comentarios e chat.

### P2

- falta politica de feature flags para liberar areas administrativas gradualmente;
- falta checklist de privacidade visual para dados pessoais do core.

## Controles obrigatorios para Fase 0 e Fase 1

1. Nenhum secret deve existir no frontend, incluindo AWS, banco e JWT privados.
2. Toda decisao de autorizacao continua pertencendo a API.
3. `401` e `403` precisam de UX padronizada antes de abrir fluxos admin reais.
4. Upload deve usar somente contrato seguro da API V2.
5. Sessao precisa ter bootstrap consistente para rotas protegidas e logout limpo.

## Backlog recomendado

- criar provider de sessao para bootstrap de `auth/me`;
- proteger paginas admin com redirect ou tela de acesso negado;
- padronizar boundary de erro para auth e autorizacao;
- revisar mascaramento de dados pessoais em listagens administrativas;
- preparar telemetria segura sem payloads sensiveis.
