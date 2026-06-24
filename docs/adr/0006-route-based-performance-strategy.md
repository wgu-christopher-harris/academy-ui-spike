# ADR 0006: Adopt Route-Based Lazy Loading and Explicit Performance Budgets

## Status

Proposed.

## Context

The current app has documented bundle splitting, route grouping, preloading, request deduplication, caching, variable font optimization, and performance budgets. It also notes that legacy route guards trigger preload and side-effect behavior before lazy routes render, hurting perceived performance.

## Decision

Use route-based lazy loading for domain features and enforce explicit performance budgets from the start.

Keep route guards focused on route eligibility. Move data preload, cache refresh, and bootstrap side effects into app shell services and domain stores.

## Consequences

- Learner-critical routes can become usable sooner.
- Optional features such as chat, streaks, observability, and session replay can load after core content.
- The team must continuously monitor bundle size and route load time.
- Some current guard behavior must be rediscovered and modeled explicitly.

## Initial Bundle Groups

- Core app shell and dashboard.
- Enrollment and checkout.
- Course experience.
- Student self-service.
- Settings and billing.
- Help and support.
- External views.
- Development-only style guide/theme routes.

## Follow-Ups

- Set production budgets for initial bundle, route chunks, styles, and assets.
- Define preloading policy by route priority.
- Add CI bundle analysis reporting before production migration.
