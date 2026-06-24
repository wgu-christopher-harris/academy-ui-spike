# PRD: Help and Support

## Status

Draft.

## Problem

Learners need fast access to policy, account, assessment, writing, math, financial, wellbeing, accessibility, Spanish-language support, and contact options. The current app includes a help center route, Formstack support, optional Genesys chat, and many static support categories.

## Users

- Prospective learners in enrollment.
- Active learners needing account, academic, assessment, or billing help.
- Learners seeking Spanish-language support or wellbeing services.

## Current Evidence

Current help routes include:

- `help-center`
- `help-center/checks`
- `help-center/support`
- `help-center/policies`
- `help-center/account`
- `help-center/soporte-en-español`
- `help-center/credit-transfer`
- `help-center/writing-resources`
- `help-center/math-resources`
- `help-center/assessment-faqs`
- `help-center/financial-avenue`
- `help-center/studentwellbeingservices`
- `help-center/ai-guidelines`

## Goals

- Give learners organized, searchable, accessible help content.
- Provide reliable contact paths when self-service content is insufficient.
- Allow support entry points to work even when chat integrations fail.
- Keep policy and support content maintainable.

## Requirements

- Help center must expose the existing support categories.
- Support contact must integrate with the approved support request form or replacement service.
- Optional chat must load asynchronously and fail gracefully.
- Help routes must support deep linking.
- Help content must be accessible on mobile and desktop.
- Help content should be content-source agnostic where possible.

## Nonfunctional Requirements

- Third-party scripts must not block page rendering.
- External links must be centralized and validated.
- Support content must satisfy accessibility standards and avoid inaccessible embedded content.

## Success Metrics

- Help page search/navigation success rate.
- Support request submissions.
- Chat load success rate.
- Support contact deflection for common topics.

## Open Questions

- Will help content remain static in the app, move to a CMS, or come from an existing knowledge source?
- Is Genesys the long-term chat platform?
- What content governance process is required?
