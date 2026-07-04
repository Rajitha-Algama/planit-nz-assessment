# Planit NZ Playwright Assessment

Automated test suite built for the Planit NZ technical assessment, targeting the [Jupiter Toys](http://jupiter.cloud.planittesting.com/) demo site.

## Overview

This project demonstrates end-to-end UI test automation using **Playwright** with the **Page Object Model (POM)** design pattern, structured logging via `test.step()`, and rich reporting through **Allure**. Tests are also wired into **GitHub Actions** for continuous integration, running automatically on every push.

## Tech Stack

- **Playwright** (JavaScript) — browser automation and assertions
- **Page Object Model (POM)** — page interactions abstracted into reusable classes under `src/pages/`
- **Allure Report** — structured, step-by-step test reporting
- **GitHub Actions** — CI pipeline that installs dependencies, runs the full suite, and reports pass/fail on every commit

## Project Structure

```
├── .github/workflows/    # GitHub Actions CI pipeline
├── src/
│   ├── pages/             # Page Object classes (ContactPage, ShopPage, CartPage)
│   └── data/
│       └── testData.json  # Test data (base URL, form inputs, etc.)
├── tests/                 # Test specs
├── playwright.config.js   # Playwright configuration (local + CI-aware settings)
└── package.json
```

## Test Cases

| Spec File | Description |
|---|---|
| `testCase_01_contact_page_validation.spec.js` | Validates contact form submission, run across 5 sequential iterations with error-continuation logic |
| `testCase_02_verify_pass_rate.spec.js` | Verifies pass/fail tracking across repeated submission attempts |
| `testCase_03_cart_verification.spec.js` | Adds multiple products to cart, verifies per-product subtotal calculations and grand total accuracy |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)

### Installation

```bash
npm install
npx playwright install
```

### Running Tests

```bash
npm test
```

Tests run headed (visible browser) locally by default, and headless automatically in CI.

### Viewing the Allure Report

```bash
npm run report
```

This serves an interactive report showing step-by-step execution details, timings, and pass/fail status for each test.

## Continuous Integration

Every push triggers a GitHub Actions workflow that:
1. Checks out the code
2. Installs dependencies and Playwright browsers
3. Runs the full test suite (headless, single worker, with retries)
4. Reports results in the Actions tab

Check the **Actions** tab on this repository for the latest run status.

## Design Notes

- **POM pattern**: each page (`ContactPage`, `ShopPage`, `CartPage`) encapsulates its own locators and actions, keeping test specs focused on *what* is being verified rather than *how* to interact with the DOM.
- **Environment-aware config**: `playwright.config.js` adjusts `headless`, `viewport`, and `slowMo` settings based on whether tests run locally or in CI, ensuring consistent behavior in both environments.
- **Resilient locators**: cart and product selectors are scoped by stable identifiers (product name, container ID) rather than dynamic values like price or item count, to avoid brittleness as cart state changes.
- **Floating-point safety**: monetary calculations (subtotals, grand totals) are verified using `toBeCloseTo()` to avoid false failures from floating-point rounding.

## Author

**Rajitha Algama**
[GitHub](https://github.com/Rajitha-Algama)
