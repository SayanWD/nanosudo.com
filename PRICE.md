# Pricing Reference (from brief)

This document summarizes the pricing data used by the brief calculation logic in the repository.
Values are taken from `src/features/brief/schemas/brief-new.ts` and example budgets from `src/lib/blog-data.ts`.

---

## Overview

- Currency: USD for hourly rates; some example budgets shown in KZT in `blog-data`.
- Note: a +40% uplift was applied to base hourly rates (see repository constants).

## Hourly Rates (USD / hour)

- Discovery: 14
- Frontend: 28
- Backend: 35
- Design (UI/UX): 24.5
- Ecommerce: 35
- Integrations: 42
- Technical (optimization, infra): 42
- Testing (QA): 21
- Deployment: 42
- Documentation: 14

- Legacy average rate (HOURLY_RATE): 70 USD/hour

These rates are defined in `src/features/brief/schemas/brief-new.ts` as `HOURLY_RATES` and `HOURLY_RATE`.

## Module Hours (baseline hours used by calculator)

Selected key values from `MODULE_HOURS` (hours):

- Frontend
  - mainPage: 10
  - innerPage: 5
  - contactForm: 4
  - interactiveMap: 8
  - calculator: 16
  - animations: 12
  - multilingual: 8
- Backend
  - restApi: 20
  - auth: 16
  - adminPanel: 24
  - database: 12
  - fileStorage: 8
  - emailNotifications: 6
- Ecommerce
  - catalog: 20
  - cartCheckout: 16
  - paymentSystem: 12
  - userAccount: 20
  - orderSystem: 16
- Integrations
  - crm: 20
  - analytics: 6
  - emailMarketing: 8
  - socialMedia: 10
  - telegramBot: 20
  - erp1c: 40
- Design
  - adaptBrandbook: 20
  - fromScratch: 32
  - uiKit: 16
- Fixed / Others
  - discovery (fixed): 12 hours
  - testing: 0.15 (coefficient — 15% of development hours)
  - deployment: 8 hours
  - documentation: 6 hours

All entries are in `MODULE_HOURS` in `brief-new.ts`.

## Coefficients

- Urgency coefficients (`URGENCY_COEFFICIENTS`):

  - urgent: 1.3 (<4 weeks)
  - normal: 1.0 (4–8 weeks)
  - flexible: 0.9 (>8 weeks)

- Complexity coefficients (`COMPLEXITY_COEFFICIENTS`):
  - landing: 1.0
  - corporate: 1.1
  - ecommerce: 1.3
  - saas: 1.5
  - custom-mvp: 1.5

## Example budget (from documentation/blog content)

Example KZT budget shown in `src/lib/blog-data.ts` (used in public content as an example):

| Phase                    | Timeline     | Cost (KZT)       |
| ------------------------ | ------------ | ---------------- |
| Discovery & spec         | 2 weeks      | 3 080 000 ₸      |
| Development (Front/Back) | 6 weeks      | 9 100 000 ₸      |
| Integrations (Kaspi/1C)  | 2 weeks      | 1 960 000 ₸      |
| QA & launch              | 1 week       | 1 190 000 ₸      |
| **Total**                | **11 weeks** | **15 330 000 ₸** |

This example mirrors the rate and conversion logic in the repository and was updated after the hourly rate uplift.

## How the calculator composes a cost (summary)

1. Sum per-module hours (based on selected modules and `MODULE_HOURS`).
2. Multiply module hours by the applicable hourly rate from `HOURLY_RATES` (by work type).
3. Apply complexity and urgency coefficients to the subtotal.
4. Add fixed items (discovery fixed hours, deployment, documentation) multiplied by their rates.
5. Apply testing as a coefficient (15% of development hours) and add testing cost.

Rough formula (informal):

```
base = Σ(moduleHours[type] * HOURLY_RATES[type])
base_with_coeffs = base * complexityCoeff * urgencyCoeff
testing = base * testingCoefficient
fixed = discoveryHours * HOURLY_RATES.discovery + deploymentHours * HOURLY_RATES.deployment + documentationHours * HOURLY_RATES.documentation
total = base_with_coeffs + testing + fixed
```

## Notes & recommendations

- Rates are stored in `src/features/brief/schemas/brief-new.ts`. Update that file to change canonical pricing.
- Currency formatting and conversion helpers live in `src/lib/currency.ts` — use them when showing localized values.
- Example KZT values in `src/lib/blog-data.ts` must be regenerated if exchange rates or coefficients change (these are static illustrative numbers in content).
- For price updates: prefer changing `HOURLY_RATES` and `HOURLY_RATE` only, then rebuild the app to pick up changes in UI and emails.

---

If you'd like, I can:

- generate a CSV or JSON representation of these rates for external tools;
- add a small `PRICE_CALC.md` with worked examples (small/medium/large project) using current constants.

Generated on: 2025-11-24
