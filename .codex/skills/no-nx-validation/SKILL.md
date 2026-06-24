---
name: no-nx-validation
description: Use for any coding task in the academy-spike Nx workspace. Prevents Codex from running Nx validation commands after code changes unless the user explicitly asks for that exact validation in the current turn.
---

# No Nx Validation

This workspace is sensitive to Nx Daemon failures. Do not run Nx validation commands as a default verification step.

## Rule

When working in this repo, do not run commands that invoke Nx for validation unless the user explicitly asks for that exact command or validation in the current turn.

Forbidden by default:

- `nx test`, `npx nx test`, or package scripts that call Nx tests
- `nx build`, `npx nx build`, or package scripts that call Nx builds
- `nx lint`, `npx nx lint`, or package scripts that call Nx lint
- `nx run`, `npx nx run`, `nx run-many`, `nx affected`, or equivalent package scripts used for tests, builds, linting, serving, or validation
- `nx serve`, `npx nx serve`, or starting Nx dev servers

Allowed without asking:

- Reading files and configs
- `rg`, `sed`, `find`, `ls`, and other non-mutating inspection commands
- TypeScript or framework-neutral checks only when they do not invoke Nx and are necessary for the task

## Verification Response

After code edits, report that Nx validation was intentionally not run due to this repo rule. If useful, suggest the exact Nx command the user can run manually.
