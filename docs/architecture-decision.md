# Architecture Decision Record: Browser-Only Request Tracker

- **Status:** Accepted for MVP
- **Date:** 2026-09-04
- **Decision owners:** Demo project team

## Context

This repository supports a short, public, sanitized training demonstration. The product must be simple to run locally, easy to inspect, and complete enough to demonstrate a disciplined specification, implementation, feedback, and UAT loop. No backend, identity provider, agency data, or production infrastructure is permitted.

## Decision

Build a single-page browser application using:

- React and TypeScript for typed UI components and state;
- Vite for development and production builds;
- plain CSS for a small, transparent design system;
- browser `localStorage` behind a dedicated storage module;
- Vitest and Testing Library for logic and component behavior; and
- Playwright for user-facing flows, persistence, responsive behavior, and keyboard interaction.

The application will use a small feature-oriented structure:

```text
src/
  components/       reusable view components
  data/             fictional seed data
  lib/              filtering, validation, and persistence
  App.tsx            feature composition and state ownership
  types.ts           domain types and allowed values
```

`App` owns the in-memory request collection and filter state. Pure library functions validate, filter, serialize, and restore data. UI components receive typed props and emit explicit callbacks. A native-dialog-inspired modal layer will be implemented with semantic HTML, focus management, and keyboard handling so behavior is testable across browsers.

## Data and persistence

- Only fictional data is included.
- A versioned key (`team-request-tracker.requests.v1`) isolates stored data.
- Parsing is guarded and the entire payload is validated before use.
- Invalid storage content falls back to seed data rather than partially trusting it.
- Writes occur only after successful creates or edits.
- Dates are represented as `YYYY-MM-DD` strings for predictable form and display behavior; timestamps use ISO 8601.

## UI and accessibility

- The main view uses summary cards, a search/filter toolbar, and responsive request cards.
- Text labels accompany every color-coded badge.
- Semantic buttons, inputs, labels, headings, and status regions are used.
- The request form is a modal dialog with initial focus, focus containment, Escape dismissal, and focus restoration.
- CSS breakpoints adapt layout; the data model and DOM order remain consistent.

## Testing strategy

- Pure unit tests cover combined filtering, validation, and resilient storage parsing.
- Component tests cover rendering, create/edit behavior, errors, and empty states.
- Playwright covers representative create/edit/persist, combined filters, clearing, validation, keyboard, and mobile-layout scenarios.
- UAT results record actual commands, outcomes, defects, corrections, and retest evidence rather than rewriting history.

## Consequences

### Benefits

- A new contributor can run and understand the project with a small toolchain.
- Typed boundaries reduce accidental invalid state.
- Isolating persistence allows a future storage adapter without redesigning the UI.
- Tests run without external services or credentials.

### Tradeoffs

- Data is limited to one browser profile and can be cleared by the user.
- There is no multi-user concurrency, access control, backup, or synchronization.
- Browser date handling and storage quotas remain platform constraints.
- The architecture is deliberately sized for the demo and is not a production deployment design.

## Alternatives considered

- **Backend API and database:** rejected because cloud storage and production infrastructure are out of scope.
- **IndexedDB:** rejected because the small record set does not require its complexity.
- **Component library:** rejected to keep the demonstration inspectable and avoid unnecessary styling/runtime dependencies.
- **Global state library:** rejected because one page and a single domain collection do not justify it.
