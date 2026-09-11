# Website Starter

A minimal fullstack monorepo starter with Nuxt 4, NestJS 12, TypeScript, Drizzle ORM, MySQL, Redis, JWT authentication, shadcn-vue, Tailwind CSS v4, and Vitest.

## Setup

```bash
pnpm install
cp apps/server/.env.example apps/server/.env
docker compose up -d
pnpm -F @__name__/server db:push
```

Requires running MySQL and Redis instances (docker-compose included, connection settings live in `apps/server/.env`).

## Development

```bash
pnpm dev
```

- Client runs at `http://localhost:3000`
- Server runs at `http://localhost:3008`

## Scripts

```bash
pnpm dev                          # start packages, client, and server (watch mode)
pnpm dev:client                   # start Nuxt client
pnpm dev:server                   # start NestJS server
pnpm dev:packages                 # start shared package watch build
pnpm build                        # build all workspaces for production
pnpm lint                         # run eslint
pnpm lint:fix                     # run eslint with auto-fix
pnpm test                         # run tests across all workspaces
pnpm test:watch                   # run tests in watch mode
pnpm typecheck                    # typecheck all workspaces
```

## Database

```bash
pnpm -F @__name__/server db:generate  # generate migration from schema
pnpm -F @__name__/server db:migrate   # apply migrations
pnpm -F @__name__/server db:push      # push schema directly to database
pnpm -F @__name__/server db:studio    # open Drizzle Studio
```

## Structure

```text
├── apps/
│   ├── client/     # Nuxt 4, Tailwind CSS v4, shadcn-vue
│   └── server/     # NestJS 12, Drizzle ORM, MySQL, Redis
├── packages/
│   └── shared/     # shared Zod schemas and crypto utilities
└── docker-compose.yml
```
