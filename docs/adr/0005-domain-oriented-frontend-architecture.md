# ADR 0005: Organize Frontend Code by Product Domain

## Status

Proposed.

## Context

The current app has broad folders such as `components`, `modules`, `services`, `store`, `models`, `guards`, and `utils`. This makes it easy for domain logic to spread across unrelated folders. The route map reveals clearer product domains: enrollment, dashboard, course, self-service, settings, billing, help, pacing, resources, communities, and shared platform services.

Nx recommends using explicit project dependency rules so applications depend on libraries, libraries depend on other libraries, and dependency direction is enforced through project tags. This gives us code ownership and architectural guardrails, but it does not by itself make a domain independently deployable. Independent deployment requires an independently built and deployed application boundary.

## Decision

Organize reusable frontend code by product domain using Nx libraries, and keep independently deployed runtime surfaces as Nx applications.

Recommended initial shape:

```text
apps/
  academy-shell/
  enrollment/
  student-portal/
libs/
  enrollment/
    feature-shell/
    feature-checkout/
    data-access/
    state/
    ui/
  dashboard/
    feature-shell/
    data-access/
    state/
    ui/
  course/
    feature-overview/
    feature-content/
    feature-assessments/
    data-access/
    state/
    ui/
  self-service/
  settings/
  help/
  platform/
    auth/
    config/
    feature-flags/
    http/
    observability/
    shell/
  shared/
    ui/
    util/
    testing/
```

Application projects own deployable runtime entry points. Library projects own reusable code.

Enrollment must not be implemented as a route-only feature buried inside `student-portal` if the business requirement is independent deployment. Enrollment should be a standalone Angular application hosted at an enrollment-owned route or subdomain.

Module Federation is intentionally not part of the initial architecture because it adds host/remote runtime complexity, version coordination risk, and operational coupling. If a future requirement demands same-SPA runtime composition, that should be evaluated in a separate ADR.

## Consequences

- Product concepts are easier to locate and test.
- Nx dependency rules can prevent accidental cross-domain imports.
- Shared code must earn its place in `shared` or `platform`.
- Teams must avoid creating dumping-ground libraries.
- Enrollment can have its own build, deployment, release gate, rollback path, and ownership model.
- Shared library changes can still affect multiple applications, so CI and release policy must treat shared libraries carefully.

## Follow-Ups

- Define Nx tags such as `scope:enrollment`, `scope:dashboard`, `type:feature`, `type:data-access`, `type:state`, and `type:ui`.
- Define allowed dependency direction.
- Create generators or templates for new feature libraries.
- Define enrollment route/subdomain ownership.
- Define CI deployment rules for affected applications.
