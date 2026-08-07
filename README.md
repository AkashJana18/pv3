# Akash Jana Portfolio

A minimal, server-rendered portfolio built with Astro, strict TypeScript, and
scoped vanilla CSS.

## Local development

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and provide a server-only GitHub token to load
pinned repositories, the contribution calendar, and merged pull requests. The
site falls back to local project data if any upstream source is unavailable.

## Verification

```bash
pnpm check
pnpm test
pnpm build
pnpm format:check
```

## Deployment

The project uses the official Vercel adapter with six-hour ISR. Connect the
repository to Vercel and configure the values documented in `.env.example`.
