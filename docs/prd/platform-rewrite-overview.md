# PRD: Platform Rewrite Overview

## Status

Draft for spike alignment.

## Source Context

The current WGU Academy student portal includes learner dashboard, enrollment, add course, course overview/content, assessments, swap course, choose path, re-enroll, resubscribe, settings, billing, manage enrollment, help center, pacing, resources, communities, external assessment views, feature flags, Genesys chat, Stripe, WooCommerce, Salesforce, Qualtrics, and LMS integrations.

Current implementation evidence:

- Main routes in `acad-student-portal-ui/src/app/app.routes.ts`
- Endpoint constants in `acad-student-portal-ui/src/app/constants/url.constants.ts`
- Dashboard loading notes in `acad-student-portal-ui/DASHBOARD_HTTP_CALLS.md`
- Performance and bundle notes in `acad-student-portal-ui/docs/PERFORMANCE_OPTIMIZATION.md`
- CI/CD notes in `acad-student-portal-ui/docs/PR_AND_CICD_PROCESS.md`

## Problem

The existing platform has accumulated mixed architecture patterns, including legacy guard-driven orchestration, mixed Angular Material/custom UI, broad route guard side effects, WordPress/WooCommerce/edX proxy dependencies, and both legacy NgRx Store/Effects and newer SignalStore usage. This makes the platform harder to evolve, harder to reason about, and harder to optimize around learner-first workflows.

## Goals

- Rebuild the student-facing platform on a modern Angular, Nx, PrimeNG, Tailwind, and NgRx SignalStore foundation.
- Create clear product-domain boundaries for enrollment, dashboard, course experience, self-service, settings, billing, help, and shared platform services.
- Improve perceived performance through route-level lazy loading, minimized guard side effects, request deduplication, and predictable caching.
- Preserve required business capabilities and integrations during a phased migration.
- Establish test, accessibility, security, performance, and CI/CD standards from day one.

## Non-Goals

- Replacing all backend systems as part of the frontend spike.
- Recreating every legacy implementation detail without product validation.
- Building an internal admin platform unless explicitly scoped later.
- Finalizing visual design beyond selecting the UI technology foundation.

## Primary Users

- Prospective or enrolling learners.
- Active WGU Academy learners.
- Learners returning to re-enroll or resubscribe.
- Learners managing billing, payment, profile, or enrollment status.
- Support and coaching teams indirectly through support, coaching, and Salesforce-facing workflows.

## Product Domains

- Enrollment and checkout
- Learner dashboard
- Course experience and assessments
- Pacing, resources, and communities
- Student self-service
- Settings, billing, and payment methods
- Help and support
- Feature flags and experimentation

## Key Integrations

- WGU Academy WordPress and authenticated WordPress proxies.
- WooCommerce cart, subscriptions, products, orders, and payment methods.
- Stripe payment setup and payment intents.
- edX/LMS course metadata, course outline, SSO, and iframe content.
- Salesforce enrollment progress.
- LaunchDarkly feature flags and observability.
- Genesys chat.
- Qualtrics exit survey.
- Formstack support forms.
- External WGU application and admissions resources.

## Success Metrics

- Enrollment funnel completion rate.
- Dashboard time to usable content.
- Course launch success rate.
- Support contact deflection for common account, billing, policy, and assessment questions.
- Self-service completion rate for pause, cancel, resume, re-enroll, resubscribe, and swap flows.
- Production bundle budget compliance.
- Unit and integration test coverage for domain stores and data-access contracts.
- Accessibility conformance for learner-critical flows.

## MVP Scope

- Authenticated app shell and navigation.
- Learner dashboard with enrollment, subscription, course, progress, and support entry points.
- Enrollment flow with user info, product selection, catalog browsing, course/requirement selection, coach/PACA steps when applicable, review, cart, and payment.
- Course overview, course content launch, assessments, and attempts.
- Settings with profile, billing, payment history, and manage enrollment.
- Help center and support routes.
- Feature flag integration.

## Risks

- Legacy APIs may encode UI-specific behavior that must be preserved or moved behind a BFF.
- Payment and subscription flows have higher compliance and regression risk.
- Guard-driven side effects in the current app may hide required sequencing that needs to be made explicit.
- LMS iframe and SSO behavior may constrain route, auth, and error handling decisions.

## Open Questions

- Which domains are required for the first production migration?
- Will the rewrite consume existing APIs directly or via a new backend-for-frontend?
- What authentication provider and session model should be used?
- What data migration or coexistence model is required?
- What analytics events and dashboards are required at MVP?
