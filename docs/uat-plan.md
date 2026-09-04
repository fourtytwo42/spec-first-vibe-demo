# Team Request Tracker — UAT Plan

- **Test date:** 2026-09-04
- **Environment:** Local Vite development server, Playwright Chromium, browser storage reset before each automated scenario
- **Data classification:** Fictional sample data only
- **Specification baseline:** `docs/requirements.md` at specification checkpoint `cbb34b6`

## Objective

Confirm that the feature branch satisfies the approved MVP requirements from a user perspective and that explicit non-goals have not entered the product.

## Entry criteria

- Specification checkpoint is committed before implementation.
- Working MVP, visual refinement, and feature refinement are committed separately.
- Unit/component tests and production build pass.
- Chromium is available to Playwright.

## Scenarios

| ID | Scenario | Expected result |
| --- | --- | --- |
| UAT-01 | Load a fresh browser profile | Four fictional sample requests appear and summary counts are correct |
| UAT-02 | Create a request with all fields and reload | Request appears with selected values and survives reload |
| UAT-03 | Edit a request status and reload | Updated status appears and survives reload |
| UAT-04 | Search title/description and combine category, priority, and status | Only requests matching every active criterion appear |
| UAT-05 | Activate filters, produce no results, then clear all | No-results guidance appears; Clear all restores all requests |
| UAT-06 | Start with an intentionally empty stored collection | Empty-workspace guidance and create action appear |
| UAT-07 | Submit blank, short, and over-limit text fields | Save is blocked, relevant feedback appears, and focus moves to the first error |
| UAT-08 | Submit malformed, impossible, and past due dates | Save is blocked and due-date feedback appears |
| UAT-09 | Open and dismiss the form using only the keyboard | Initial focus is correct, Escape closes, and focus returns to the opener |
| UAT-10 | Use the application at a 375 × 812 viewport | Content reflows without horizontal page scrolling |
| UAT-11 | Reload with malformed local storage | Application safely restores fictional sample data |
| UAT-12 | Inspect content and network behavior | No authentication, cloud storage, notifications, production deployment, or agency data is present |

## Exit criteria

- All automated unit/component, build, and Playwright checks pass.
- Each UAT scenario has a recorded result.
- Any failed scenario has preserved initial evidence, a correction, and targeted plus regression retest results.
- No release, merge, or production deployment action occurs during UAT.
