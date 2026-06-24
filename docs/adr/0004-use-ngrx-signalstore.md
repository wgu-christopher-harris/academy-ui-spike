# ADR 0004: Use NgRx SignalStore for Feature State

## Status

Accepted.

## Context

The current portal contains legacy NgRx Store/Effects state for feature flags, student access, streaks, assessment, loader, and PACA, while enrollment already includes SignalStore files. Angular signals and NgRx SignalStore better fit modern Angular feature state and reduce selector/action/effect boilerplate for localized domains.

Angular's Resource API and the Angular Architects NgRx Toolkit `withResource` extension provide a signal-native way to model read/query state inside SignalStore. This reduces the need to create service wrappers whose only responsibility is forwarding simple `GET` requests.

## Decision

Use NgRx SignalStore as the default feature state pattern.

Use local component signals for simple view-only state. Use SignalStore for feature state that coordinates API calls, caching, derived state, multi-component workflows, or command state.

For read/query state, prefer resource-backed SignalStore features where the request is simple, signal-driven, and scoped to the owning domain store. Use `withResource` when composing Angular resources into SignalStore. Stores may use typed data-access helpers for URL construction, DTO/domain mapping, and error classification instead of calling a service method for every read.

Keep explicit data-access services or clients for commands, multi-step workflows, non-GET requests, high-risk integrations, and API calls that require custom retry, idempotency, or error handling behavior.

## Consequences

- Feature state becomes easier to colocate with domain libraries.
- Read/query state can use Angular resource status and value semantics directly from SignalStore.
- Async call state, stale data, request deduplication, refresh behavior, and command states must be standardized.
- Legacy global Store/Effects patterns should not be introduced by default.
- Shared app state should be rare and explicitly justified.
- Resource-backed reads reduce boilerplate, but teams must still preserve typed API boundaries and avoid leaking transport details into components.

## Follow-Ups

- Create a standard SignalStore resource pattern for `loading`, `loaded`, `error`, `stale`, `refreshing`, default values, and manual refresh.
- Create conventions for entity collections, selected entity, commands, optimistic updates, and route parameter hydration.
- Decide whether any app-wide concerns still require classic NgRx Store.
