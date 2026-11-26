# AI-Performance-testing

## OrangeHRM Playwright performance smoke framework

This TypeScript project runs parallel Playwright browser journeys against the public OrangeHRM demo. It uses Page Objects and shared fixtures for login, dashboard, and PIM interactions. Each test checks the requested functional outcome and measures its user-visible step against a configurable performance budget. Browser navigation timings and measured step durations are attached to the Playwright HTML report.

These are browser-based performance smoke checks, not concurrent load or stress tests.

## Framework structure

```text
config/       Demo URL, credentials, search term, and performance budget
pages/        Login, dashboard, and PIM Page Objects
tests/        Journeys, reusable fixtures, and isolated browser-context checks
utils/        Timing capture and report attachments
playwright.config.ts
```

## Setup and execution

Requirements: Node.js 18+ and npm.

```powershell
npm install
npx playwright install chromium
npm run test:allure
npm run allure:generate
```

The public demo credentials (`Admin` / `admin123`) are used by default. Override them with `ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD` if the demo changes or a different authorized test account is required. Unless `ORANGEHRM_EMPLOYEE_SEARCH_TERM` is set, the employee search test takes the first ID in the live demo's unfiltered employee list so it tolerates demo-data changes.

Useful settings:

- `ORANGEHRM_BASE_URL`: defaults to `https://opensource-demo.orangehrmlive.com`
- `PERFORMANCE_BUDGET_MS`: per-step and initial page-load budget; defaults to `12000`
- `PLAYWRIGHT_WORKERS`: parallel worker count; defaults to `2`
- `PLAYWRIGHT_RETRIES`: retry count; defaults to `0` locally and `2` when `CI` is set

The test run writes `playwright-report/index.html`. Open it with:

```powershell
npm run report
```

Allure results are written to `allure-results/`; the generated HTML report is in
`allure-report/`. Open the report with:

```powershell
npm run allure:open
```

Or start a temporary server that generates and serves a report directly from the
latest results:

```powershell
npm run allure:serve
```

Each HTML report test includes JSON attachments for the measured action duration and browser navigation metrics (TTFB, DOMContentLoaded, load event, transfer size, and resource count). Every test gets an isolated Playwright context by default. The shared `createBrowserContext` fixture creates and automatically closes additional isolated contexts for tests that need them.
