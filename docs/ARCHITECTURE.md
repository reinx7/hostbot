# Arquitetura HostBot

## Decisão principal

O app web roda em Next.js 15 no Vercel ou em container próprio. O runtime de bots roda fora da Vercel, em VPS ou cluster com Docker Engine. Essa separação evita limites de serverless e permite containers persistentes.

## Fluxo de upload

1. Usuário envia ZIP no painel.
2. Route Handler valida sessão, tamanho e extensão.
3. Arquivo é salvo em storage temporário.
4. Deployment é criado como `QUEUED`.
5. BullMQ recebe job de deploy.
6. Worker extrai ZIP, analisa stack, atualiza BotConfig.
7. Docker Manager cria container isolado.
8. WebSocket transmite logs.
9. Metrics worker coleta CPU/RAM e persiste em BotMetrics.

## Multi-tenant

- `User` pode participar de vários `Team` via `TeamMember`.
- `Bot` pode pertencer a um usuário e opcionalmente a um time.
- Permissões devem ser checadas em `services/authorization.ts` antes de mutações.

## Segurança

- Validar todas as entradas com Zod.
- Nunca expor EnvVariable.value diretamente.
- Executar containers com CapDrop, no-new-privileges, limites de CPU/RAM/PIDs.
- Usar rede Docker isolada.
- Auditar ações sensíveis.
