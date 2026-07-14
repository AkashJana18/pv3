# Akash Jana Portfolio

Minimal Next.js portfolio for Akash Jana, focused on Rust, Solana, trading infrastructure, developer tooling, and open-source work.

## Integrations

- GitHub pinned repositories are fetched server-side through the GitHub GraphQL API when `GITHUB_TOKEN` is available.
- DEV.to articles are fetched server-side through the DEV.to API.
- Medium articles are fetched server-side through a configurable RSS feed.
- All external data has cached revalidation and local fallbacks so production builds do not depend on third-party availability.

## Local setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

For live pinned repositories, set `GITHUB_TOKEN` in `.env.local`.

## Verification

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build
```
