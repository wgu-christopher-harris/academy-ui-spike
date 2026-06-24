# ADR 0002: Use Nx as the Workspace and Monorepo Foundation

## Status

Accepted.

## Context

The current app uses Nx scripts for serve, build, lint, test, e2e, and run-many operations. The rewrite should use Nx intentionally for workspace boundaries, task orchestration, generators, affected commands, and future multi-app/library growth.

## Decision

Use Nx as the workspace foundation for the rewrite.

Organize the repo around applications and domain libraries rather than a single large app folder.

## Consequences

- Domain boundaries can be enforced through Nx projects and tags.
- CI can run affected lint, test, and build tasks.
- Shared UI, data access, state, and utility libraries can be versioned and governed in one workspace.
- The team must maintain clear project naming, tagging, and dependency rules.

## Follow-Ups

- Define initial Nx project layout.
- Add lint rules for dependency boundaries.
- Decide whether backend-for-frontend code belongs in this workspace.
