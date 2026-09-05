# Copilot instructions

## Project overview

This repository contains Akash Jana's personal portfolio, built as a
server-rendered Astro site and deployed to Vercel. The site presents profile
information, selected GitHub projects and activity, writing links, and contact
details with a minimal, dark, editorial visual style.

The application uses Astro 7, strict TypeScript, scoped vanilla CSS, and
server-side integrations for GitHub, DEV.to, Medium, and weather data. Keep
the site fast, lightweight, and resilient when external services are
unavailable.

## Agent notes

- Read the relevant existing files before changing code and follow established
  patterns rather than introducing a new abstraction.
- Do not expose secrets or server-only environment variables to client-side
  code. Use `src/lib/env.ts` for environment access and keep `.env` local.
- Preserve the local fallback data path whenever changing an external data
  source. A failed upstream request must not make the portfolio unusable.
- Keep changes focused. Do not add dependencies, framework features, or
  generated output unless the task requires them.
- Use the `@/*` alias for imports from `src`.
- Do not edit generated directories such as `dist/`, `.astro/`, or
  `.vercel/`.

## Code standards

- Use TypeScript with the strict compiler settings already enabled in
  `tsconfig.json`. Prefer explicit domain types from `src/types/portfolio.ts`
  and type-safe helpers over casts.
- Use double quotes, no semicolons, two-space indentation, and an 80-character
  print width. Run Prettier rather than manually formatting large sections.
- Every exported function should have a concise TSDoc comment describing its
  purpose, parameters, and return value.
- Before imports or any code, add a short file-level comment block explaining
  the file's purpose when creating a new source file.
- Keep functions small and deterministic where practical. Normalize and
  validate external data at the boundary before passing it to components.
- Handle errors explicitly. Do not add broad catches, silent fallbacks, or
  success-shaped responses that hide a failure. Use the existing fallback
  conventions for upstream services.
- Prefer semantic HTML, accessible names, keyboard support, and visible focus
  states. Preserve responsive behavior and the existing dark visual language.
- Keep browser JavaScript minimal. Prefer Astro server rendering and static
  markup; add client-side behavior only when the interaction needs it.
- For Astro components, keep frontmatter, markup, and styles organized in the
  existing style. Use scoped styles unless a rule genuinely belongs in
  `src/styles/global.css`.
- Keep external links, metadata, structured data, and canonical URLs
  consistent with `src/config/site.ts` and the configured `SITE_URL`.

## Data and integrations

- GitHub and writing integrations must remain safe with missing credentials,
  rate limits, timeouts, malformed responses, and upstream HTTP errors.
- Use the shared fetch and timeout behavior in `src/lib/http.ts` instead of
  creating ad hoc request handling.
- Keep API keys and tokens on the server. Never interpolate secrets into HTML,
  public configuration, logs, or URLs.
- Update fallback data and types together when changing the shape of portfolio
  content.

## Testing and verification

- Add or update Vitest unit tests for changes to data normalization, parsing,
  fallback behavior, or integration clients. Mock network access through the
  existing `Fetcher` pattern.
- Before completing a change, run the smallest relevant checks. For a
  cross-cutting change, use:

  ```bash
  pnpm check
  pnpm test
  pnpm build
  pnpm format:check
  ```

- Do not modify tests merely to make an implementation pass; preserve coverage
  for failure paths and deterministic fallback behavior.

## Scripts

- `pnpm dev` starts the local Astro development server.
- `pnpm check` runs Astro and TypeScript checks.
- `pnpm test` runs the Vitest suite once.
- `pnpm build` creates the production Vercel build.
- `pnpm format:check` checks repository formatting.
- `pnpm format:write` applies the configured Prettier formatting.

## Repository structure

- `src/pages/` contains Astro routes and server entry points.
- `src/layouts/` contains shared page shells and document metadata.
- `src/components/` contains reusable UI components.
- `src/lib/` contains environment handling, HTTP utilities, external data
  clients, parsing, normalization, and related unit tests.
- `src/config/` contains site configuration and local fallback content.
- `src/types/` contains shared domain types.
- `src/styles/` contains global CSS and design tokens.
- `public/` contains static assets served without transformation.
- `astro.config.mjs` configures the Vercel adapter, ISR, sitemap, and image
  handling.
- `.env.example` documents supported environment variables; keep it free of
  real credentials.

## GitHub Actions workflows

If workflows are added or changed, use pinned or trusted actions, least
privilege permissions, explicit Node and pnpm versions matching the project,
and avoid printing environment variables or tokens. Keep CI commands aligned
with the verification scripts in `package.json`.
