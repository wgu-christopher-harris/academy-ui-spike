# ADR 0008: Establish Testing, Quality, and Security Gates

## Status

Proposed.

## Context

The current app requires linting, headless tests, SonarCloud, Veracode scanning, PR title enforcement, semantic release, GitHub Release packaging, and Octopus/Argo deployment orchestration. README guidance states changes require 80% code coverage.

## Decision

Adopt automated quality and security gates from the beginning of the rewrite.

Minimum gates:

- Typecheck.
- Lint.
- Unit tests.
- Focused integration tests for SignalStores and data-access contracts.
- E2E smoke tests for learner-critical flows.
- Accessibility checks for core routes.
- Bundle budget checks.
- Dependency and static security scanning.
- Conventional PR title or commit validation.

## Consequences

- The rewrite has production-grade feedback loops early.
- High-risk flows such as enrollment, checkout, payment methods, course launch, and self-service require stronger test coverage.
- CI duration must be managed with Nx affected tasks and test partitioning.

## Follow-Ups

- Pick the E2E framework.
- Decide whether 80% coverage remains the standard or whether domain-specific thresholds are better.
- Define required smoke tests for MVP.
- Confirm security scanning tools and required secrets for the new repo.
