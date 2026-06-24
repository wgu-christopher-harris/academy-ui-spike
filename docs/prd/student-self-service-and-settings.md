# PRD: Student Self-Service and Settings

## Status

Draft.

## Problem

Learners need to manage personal information, billing preferences, payment methods, order history, and enrollment changes without support intervention. The current app includes settings, billing, manage enrollment, pause/cancel/resume, re-enroll, resubscribe, swap, payment history, payment methods, and Qualtrics exit survey behavior.

## Users

- Active learners managing account or billing details.
- Learners cancelling, pausing, resuming, swapping, re-enrolling, or resubscribing.
- Learners reviewing payment history and invoices.

## Goals

- Provide a trustworthy self-service area for account, billing, and enrollment management.
- Reduce support dependency for common lifecycle changes.
- Make payment and subscription state understandable.
- Handle survey and policy requirements during cancellation or withdrawal flows.

## Requirements

- Settings must include personal information.
- Billing must include payment preferences, payment methods, payment plan details, and payment history.
- Learners must be able to view order details by order id.
- Manage enrollment must support eligible self-service actions.
- Self-service actions must be feature-flagged where required.
- Re-enroll and resubscribe flows must be supported when eligible.
- Swap course flow must include explanation, course browsing, review, and confirmation.
- Cancel, pause, resume, and withdraw flows must handle eligibility, confirmation, API response, and error states.
- Qualtrics exit survey integration must only accept trusted origins.

## Nonfunctional Requirements

- Payment method data must be tokenized and handled through approved payment APIs.
- Self-service commands must be idempotent or protected against duplicate submission.
- Eligibility checks must be explicit and observable in state.
- Settings and self-service features must be lazy-loaded separately from dashboard.
- Audit-relevant user actions must be trackable.

## Success Metrics

- Self-service completion rate.
- Support contact reduction for billing and enrollment changes.
- Payment method update success rate.
- Cancellation, pause, resume, re-enroll, resubscribe, and swap error rates.

## Open Questions

- Which self-service actions are MVP?
- Which actions require support review or policy gates?
- What audit trail is required for subscription and enrollment changes?
