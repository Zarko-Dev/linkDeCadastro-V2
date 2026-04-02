# Vercel Setup

## Objetivo

Padronizar o deploy do frontend V2 na Vercel.

## Base adotada

- framework `nextjs`
- build command `npm run build`
- output gerenciado pelo próprio Next.js
- App Router servido nativamente pela Vercel

## Arquivos relevantes

- `vercel.json`
- `.vercelignore`
- `.env.example`

## Variáveis de ambiente esperadas

- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_API_URL`

## Ambientes recomendados

### Preview

- `NEXT_PUBLIC_APP_ENV=preview`
- `NEXT_PUBLIC_API_URL=<url da API de preview>`

### Production

- `NEXT_PUBLIC_APP_ENV=production`
- `NEXT_PUBLIC_API_URL=<url da API de produção>`

## Notas

- apenas variáveis `NEXT_PUBLIC_*` ficam disponíveis no bundle;
- nunca colocar secrets privados no frontend;
- toda mudança de domínio da API deve ser refletida na `NEXT_PUBLIC_API_URL`.
