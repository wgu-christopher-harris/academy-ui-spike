# ADR 0001: Use Angular Latest as the Frontend Framework

## Status

Accepted.

## Context

The current student portal is already an Angular application and has been upgraded to modern Angular packages. The rewrite should preserve team familiarity and ecosystem compatibility while removing accumulated legacy structure.

## Decision

Use the latest stable Angular version available when the greenfield implementation begins.

Default to standalone components, functional route guards/resolvers/interceptors where appropriate, Angular signals for local reactivity, and lazy route loading.

## Consequences

- Existing Angular knowledge remains useful.
- Migration can happen by product domain instead of requiring a full platform/tooling change.
- Modern Angular patterns reduce NgModule and boilerplate usage.
- The project must track Angular, TypeScript, Nx, PrimeNG, and NgRx compatibility as one upgrade unit.

## Follow-Ups

- Confirm the exact Angular version at project creation time.
- Define Angular coding standards for standalone components, dependency injection, inputs/outputs, templates, and route composition.
