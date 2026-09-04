# Spec-First Vibe Demo

This repository accompanies an ICJIA training on building software with AI. It demonstrates a two-stage workflow:

1. Create and approve a clear specification.
2. Refine the working product through deliberate, testable feedback.

The demonstration application is a fictional Team Request Tracker. It uses sample data only and does not connect to ICJIA systems.

## Demo scope

The application supports create/edit workflows, category, priority, status, optional due dates, combined search and filters, responsive layouts, accessible keyboard controls, and browser-local persistence. All included requests are fictional.

Authentication, cloud storage, notifications, production deployment, and agency data are explicitly excluded. See [the requirements](docs/requirements.md) and [architecture decision](docs/architecture-decision.md) for the full boundary.

## Run locally

Requirements: a current Node.js release and npm.

```bash
npm install
npm run dev
```

The terminal prints the local URL. Data is stored only in the current browser's `localStorage`.

## Verify

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The repository uses Vitest and Testing Library for unit/component coverage and Playwright for browser-level acceptance flows.
