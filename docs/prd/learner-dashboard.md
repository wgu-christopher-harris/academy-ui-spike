# PRD: Learner Dashboard

## Status

Draft.

## Problem

Learners need a fast, reliable landing experience that summarizes current enrollment, subscription status, course progress, coaching/support resources, next actions, and available Academy pathways. The current dashboard pulls multiple APIs and conditionally loads feature-flagged services, which creates a high-risk entry point for perceived performance.

## Users

- Active learners.
- Returning learners with expired, paused, cancelled, or completed enrollment states.
- Graduated learners being directed toward WGU degree enrollment.

## Current Evidence

Current dashboard loading includes:

- Feature flags: `/feature-flags/list`
- Dashboard data: `/edx-auth-wp-proxy/api/ibl/v2/dashboard/`
- Dashboard courses: `/edx-auth-wp-proxy/api/ibl/v2/dashboard/courses/`
- Enrollment categories: `/edx-auth-wp-proxy/api/ibl/v2/enrollment/categories`
- Optional Genesys chat script.
- Optional streaks/gamification events.

## Goals

- Render learner-critical dashboard content quickly after authentication.
- Show current courses, progress, enrollment status, subscription status, and next actions.
- Provide clear paths into course content, pacing, resources, communities, settings, billing, manage enrollment, and help.
- Support feature-flagged experiences without blocking base dashboard rendering.
- Cache dashboard data with explicit freshness and refresh behavior.

## Requirements

- The dashboard must load feature flags before deciding which optional experiences to show.
- The dashboard must request dashboard summary data and courses in parallel where possible.
- The dashboard must deduplicate in-flight requests.
- The dashboard must display loading, empty, partial, stale, and error states.
- The dashboard must support stale-while-revalidate behavior for recently loaded dashboard data.
- The dashboard must expose support entry points without relying on third-party chat loading success.
- The dashboard must support desktop and mobile navigation patterns.
- The dashboard must allow deep links to course overview, course content, settings, billing, manage enrollment, pacing, resources, communities, and help center.

## Nonfunctional Requirements

- Initial dashboard route must stay within the agreed route bundle budget.
- Optional services such as chat, gamification, or session replay must not block dashboard content.
- Dashboard state must be modeled through a feature SignalStore.
- API responses must be typed and normalized at the data access boundary.
- Accessibility must cover keyboard navigation, focus states, screen reader labels, and loading/error announcements.

## Success Metrics

- Time to usable dashboard content.
- Dashboard API error rate.
- Course launch click-through rate.
- Support entry usage.
- Stale cache hit rate and refresh latency.

## Open Questions

- What exact dashboard cards should ship in MVP?
- Should pacing, resources, and communities be first-class dashboard cards or secondary navigation?
- Which learner states require custom dashboard variants?
