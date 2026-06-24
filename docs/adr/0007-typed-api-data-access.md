# ADR 0007: Standardize Typed API Data Access

## Status

Proposed.

## Context

The current app integrates with many APIs: authenticated WordPress proxy, unauthenticated WordPress proxy, WooCommerce Store API, Stripe setup/payment intent endpoints, edX/LMS metadata and SSO endpoints, Salesforce enrollment progress, Qualtrics survey metadata, Formstack, Genesys, LaunchDarkly, and WGU external admissions resources.

The rewrite needs a consistent data boundary so components and feature state do not couple directly to backend URL details or transport quirks.

ADR 0004 selects NgRx SignalStore for feature state. Angular's Resource API and the Angular Architects NgRx Toolkit `withResource` extension allow simple read/query API state to be composed directly into SignalStore without requiring a service wrapper around every `GET` request.

## Decision

Create typed domain data-access libraries for API integration.

Each data-access library owns endpoint contracts, request/response DTOs, mapping from DTOs to domain models, error classification, and transport-specific behavior. Feature components should depend on domain stores, not raw HTTP services.

Use a hybrid data boundary:

- Resource-backed reads may be composed in SignalStores with `withResource` when the request is simple, signal-driven, and scoped to the owning domain.
- Data-access libraries should provide the typed helpers needed by those resources, such as URL/request builders, generated model types, DTO/domain mappers, and error classifiers.
- Keep explicit data-access services or clients for commands, mutations, multi-step workflows, non-GET behavior, and APIs that require custom retry, idempotency, auth, payment, eligibility, or dependency-specific handling.

## Consequences

- API complexity is isolated from UI and state layers.
- Backend migration can happen behind data-access contracts.
- Error handling can become consistent across product domains.
- DTO/domain model mapping requires disciplined maintenance.
- Simple reads avoid unnecessary service pass-through methods while still preserving typed API contracts.
- Stores can own query lifecycle state directly, but transport details must remain behind data-access helpers or platform HTTP infrastructure.

## Follow-Ups

- Decide whether to call existing APIs directly or introduce a backend-for-frontend.
- Generate API clients and DTOs from OpenAPI where available.
- Define typed error categories for auth, validation, payment, eligibility, unavailable dependency, and unexpected failure.
- Define conventions for request builders and mappers used by resource-backed stores.
- Centralize runtime environment configuration.
