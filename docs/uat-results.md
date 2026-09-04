# Team Request Tracker — UAT Results

- **Executed:** 2026-09-04
- **Branch:** `feature/request-tracker-mvp`
- **Environment:** Windows, Node.js 24.14.0, Playwright Chromium, local Vite server
- **Final outcome:** Passed after one UAT correction

## Summary

UAT exercised the approved specification in `docs/requirements.md` using fictional data only. The initial implementation passed the working-flow, persistence, filtering, empty-state, responsive, storage-recovery, and keyboard scenarios. It failed the negative due-date scenario because a past date was accepted. That failure is preserved below. The shared validator and form were corrected, a unit regression was added for malformed, impossible, past, and same-day values, and the targeted and full suites then passed.

## Scenario results

| ID | Final result | Evidence |
| --- | --- | --- |
| UAT-01 | Pass | Fresh-storage browser setup rendered four fictional sample cards and summary count `4` |
| UAT-02 | Pass | Chromium created a fully populated fictional request and found it after reload |
| UAT-03 | Pass | Chromium changed the created request to Complete and found the updated state after reload |
| UAT-04 | Pass | Combined search + Data + High + In progress returned only “Refresh quarterly dashboard” |
| UAT-05 | Pass | A conflicting category showed “No matching requests”; Clear all restored four cards |
| UAT-06 | Pass | Stored `[]` rendered “No requests yet” with a create action |
| UAT-07 | Pass | Component and unit checks blocked blank, short, and over-limit input and exposed field feedback |
| UAT-08 | Pass after correction | Initial targeted run failed; corrected targeted run and regression suite passed (details below) |
| UAT-09 | Pass | Chromium verified initial title focus, Escape dismissal, and opener focus restoration |
| UAT-10 | Pass | At 375 × 812, document scroll width did not exceed client width |
| UAT-11 | Pass | Unit checks restored sample data for malformed JSON and structurally invalid records |
| UAT-12 | Pass | Source/package inspection found browser-only storage and no authentication, cloud, notification, deployment, or agency-data integration |

## Preserved defect evidence: invalid due date

### Initial result — failed

Against feature-refinement commit `36a0bfd`, the UAT check entered title “Check fictional archive” and due date `2000-01-01`, then submitted the form.

Command:

```text
npx playwright test -g "rejects a past due date"
```

Observed result:

```text
1 failed
Locator: getByRole('dialog').getByText('Due date cannot be in the past.')
Expected: visible
Error: element(s) not found
```

The form closed and the request was accepted instead of showing the required validation. Root cause: `validateDraft` checked required/enumerated fields and text lengths but did not validate `dueDate`.

### Correction

- Added strict `YYYY-MM-DD` calendar validation, including impossible dates.
- Added a local-calendar “today” boundary and rejected earlier values.
- Added the current date as the form control's `min` hint.
- Connected due-date feedback with `aria-invalid` and `aria-describedby`.
- Added deterministic unit coverage for malformed, impossible, past, and same-day dates.
- Retained the failing Playwright scenario as a browser regression test.

### Targeted retest — passed

```text
npx playwright test -g "rejects a past due date"
1 passed (2.5s)
```

The dialog remained open and displayed “Due date cannot be in the past.”

## Final regression evidence

All commands were executed after the correction:

```text
npm test
Test Files  3 passed (3)
Tests       7 passed (7)

npm run build
TypeScript check passed
Vite production build completed: 23 modules transformed

npm run test:e2e
5 passed (3.4s)
```

`npm install` also reported zero known vulnerabilities at implementation time.

## Limitations and residual risk

- Browser automation ran in Chromium only; Firefox, WebKit, and assistive-technology screen-reader passes were not performed.
- Data remains intentionally limited to one browser profile's `localStorage`; clearing site data removes user-created requests.
- There is no authentication, authorization, cloud storage, synchronization, notification delivery, production deployment, or agency-system connection.
- The demo does not include deletion, attachments, comments, audit history, or multi-user behavior because those are outside the approved MVP.

## Exit decision

UAT exit criteria are met. The branch is suitable for review. This result does not authorize opening or merging a pull request, deploying the application, or creating a release tag.
