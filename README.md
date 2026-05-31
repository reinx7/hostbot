# HostBot

**Hospedagem poderosa, simples e confiável para seu bot Discord**

HostBot é uma plataforma SaaS premium para hospedagem de bots Discord, construída com Next.js 15, Prisma, PostgreSQL, Redis, BullMQ, Docker e WebSocket. O projeto foi desenhado como base enterprise-grade para multi-tenancy, deploy em filas, containers isolados, console em tempo real, auditoria, billing e painel cloud moderno.

> Este repositório é um starter profissional e extensível. Integrações sensíveis como billing real, varredura antivírus, storage S3 e gateway de containers remoto devem ser finalizadas conforme o ambiente de produção.

## Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS + shadcn/ui style components + Framer Motion
- Auth.js / NextAuth com Discord, Google e Magic Link
- Prisma ORM + PostgreSQL
- Redis + BullMQ
- WebSocket com `ws`
- Dockerode para gerenciamento de containers
- Docker Compose para desenvolvimento local

## Arquitetura resumida

```txt
Browser
  ├─ Next.js App Router: páginas, server components e route handlers
  ├─ WebSocket client: console e métricas realtime
  └─ Upload client: drag-and-drop + progresso

Next.js Server
  ├─ Auth.js: sessões, providers OAuth e magic link
  ├─ Route Handlers: bots, upload, deployments, teams
  ├─ Server Actions: ações seguras do painel
  ├─ Prisma: persistência multi-tenant
  └─ BullMQ Producer: cria jobs assíncronos

Workers
  ├─ deploy-worker: valida artefato, cria imagem/container, registra deploy
  ├─ metrics-worker: coleta CPU/RAM/logs/status
  └─ cleanup-worker: remove temporários e órfãos

Infra
  ├─ PostgreSQL: dados transacionais
  ├─ Redis: filas, pub/sub e rate limit
  ├─ Docker Engine: runtime dos bots
  └─ Vercel/VPS: frontend + API / workers em host persistente
```

## Instalação local

```bash
git clone <repo-url> hostbot
cd hostbot
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run dev:all
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

Veja `.env.example`. Configure OAuth no Discord Developer Portal e Google Cloud Console. Para produção, use segredos fortes, URLs HTTPS e Redis/Postgres gerenciados.

## Deploy recomendado

### Vercel

Use Vercel para o app Next.js. Workers, WebSocket dedicado e Docker Manager devem rodar em uma VPS/Kubernetes/Fly.io/Render com acesso ao Docker Engine, porque Vercel é serverless e não executa containers Docker de clientes de forma persistente.

```bash
vercel link
vercel env pull .env.production.local
npm run build
vercel deploy --prod
```

### VPS para runtime de bots

```bash
scp -r . user@server:/opt/hostbot
ssh user@server
cd /opt/hostbot
cp .env.example .env
nano .env
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Scripts úteis

```bash
npm run dev               # Next.js
npm run dev:all           # Next + workers + websocket
npm run worker:deploy     # Worker de deploy
npm run worker:metrics    # Worker de métricas
npm run db:migrate        # Migrações locais
npm run db:deploy         # Migrações produção
npm run zip               # Gera ZIP do projeto
```

## Segurança

- Rate limit em APIs críticas
- Zod em entradas externas
- Validação de upload por tamanho/extensão
- Containers com limites CPU/RAM/PIDs
- Rede Docker isolada
- Usuário não-root nos containers base
- Audit logs para ações sensíveis
- Soft delete em entidades principais
- Segredos de bot nunca retornam em API pública

## Troubleshooting

**Prisma não conecta:** verifique `DATABASE_URL` e se o Postgres está ativo.

**BullMQ não processa:** verifique `REDIS_URL` e rode `npm run worker:deploy`.

**Dockerode falha:** o processo precisa de acesso ao Docker socket ou endpoint remoto seguro.

**WebSocket não conecta:** confira `NEXT_PUBLIC_WS_URL` e firewall da porta `3001`.

## Como gerar ZIP

```bash
npm run zip
```

Ou manualmente:

```bash
cd ..
zip -r hostbot.zip hostbot -x "hostbot/node_modules/*" "hostbot/.next/*"
```
