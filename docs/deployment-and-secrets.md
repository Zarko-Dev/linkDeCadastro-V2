# Deployment and Secrets - Frontend V2

## Vercel

- manter no projeto apenas variaveis `NEXT_PUBLIC_*` realmente necessarias no browser;
- apontar `NEXT_PUBLIC_API_URL` para a API V2 correta por ambiente;
- nunca replicar credenciais de AWS, banco, JWT privado ou webhook no frontend;
- revisar dominios de preview e producao para compatibilidade com `CORS` da API.

## Seguranca de configuracao

- o frontend nao precisa de `DATABASE_URL`, `MONGODB_URL`, `AWS_SECRET_ACCESS_KEY` ou segredos equivalentes;
- variaveis publicas devem ser tratadas como publicas por definicao;
- qualquer configuracao sensivel deve ficar do lado da API ou do provedor.

## Checklist de deploy

- validar `NEXT_PUBLIC_API_URL` do ambiente;
- validar que o login escreve sessao no browser sem expor refresh token;
- revisar headers de seguranca entregues pelo app;
- testar navegacao de auth e expiracao de sessao contra a API real.
