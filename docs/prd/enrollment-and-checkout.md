# PRD: Enrollment and Checkout

## Status

Draft.

## Problem

Prospective learners need a clear flow to provide personal information, select an Academy offering, browse catalog options, complete required PACA/coach-related steps, review selections, and pay. The current implementation spans route steps, cart APIs, product metadata, Stripe, WooCommerce, Salesforce progress updates, and feature-flagged course selection.

## Users

- New prospective learners.
- Returning learners adding courses or selecting alternate pathways.
- Learners enrolling in single courses, bundled courses, certificates, or guaranteed admission offerings.

## Current Evidence

The current enrollment routes include:

- `enrollment/welcome`
- `enrollment/welcome/2`
- `enrollment/welcome/2/browse-catalog`
- `enrollment/welcome/3`
- `enrollment/welcome/3/paca`
- `enrollment/welcome/3/coach`
- `enrollment/welcome/3/review`

Relevant integrations include user registration, email and username availability, product catalog, program data, pronouns, coach strengths/weaknesses, cart operations, Stripe payment intent creation, Salesforce enrollment progress, and WooCommerce products/subscriptions.

## Goals

- Create a guided enrollment flow with predictable step state and recoverability.
- Support product and course selection across Academy offerings.
- Integrate cart, coupon, customer, and payment steps without leaking API complexity into components.
- Persist enrollment progress where required.
- Make validation and error recovery clear for learners.

## Requirements

- The flow must support user information collection and validation.
- The flow must check email availability, display name availability, and existing user status.
- The flow must support selecting an offering and browsing catalog items.
- The flow must support certificate and guaranteed admission program structures.
- The flow must support course metadata, alternate courses, and school/course area filtering.
- The flow must conditionally include PACA, coach, requirements, and review/payment steps.
- The flow must support cart add, update, remove, coupon apply/remove, and customer update.
- The flow must create payment intents through the approved backend endpoint.
- The flow must support Stripe setup and payment method collection.
- The flow must persist or update enrollment progress when required by Salesforce.
- The flow must handle logged-out and logged-in learner variants.

## Nonfunctional Requirements

- Step state must live in a domain SignalStore, not route components.
- Route guards must only enforce route eligibility, not perform broad preloading side effects.
- Payment and cart operations must have explicit loading, retry, decline, and validation states.
- Sensitive payment handling must use Stripe-hosted/tokenized primitives.
- Enrollment copy and policy links must be content-managed or isolated from component logic where practical.
- The flow must meet accessibility requirements for form errors, steppers, focus management, and payment controls.

## Success Metrics

- Enrollment start-to-completion rate.
- Step-level abandonment rate.
- Payment success and decline recovery rate.
- Catalog browse-to-selection rate.
- API validation error rate.

## Open Questions

- Which offering types are required for MVP?
- Should logged-in add-course and logged-out enrollment share one domain model?
- What enrollment progress must be persisted to Salesforce during the flow?
- Which policies and disclosures require legal approval before launch?
