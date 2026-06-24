# ADR 0003: Use PrimeNG and Tailwind for the UI Foundation

## Status

Accepted.

## Context

The current portal uses a mixture of Angular Material, custom components, Tailwind, and Academy-specific styling. The rewrite should converge on a smaller, consistent UI foundation while still supporting a WGU Academy design system.

## Decision

Use PrimeNG as the primary component library and Tailwind as the utility styling foundation.

Use `tailwindcss-primeui` or the current supported PrimeNG/Tailwind integration to align tokens and component theming.

## Consequences

- Teams get accessible, production-ready UI primitives faster than custom-building every control.
- Tailwind provides consistent layout and spacing utilities.
- Custom design system work can focus on tokens, wrappers, composition, and learner-specific experiences.
- Existing Angular Material usage should not be carried forward unless there is a documented exception.

## Follow-Ups

- Define token ownership for color, typography, spacing, elevation, radius, and motion.
- Decide whether shared UI components wrap PrimeNG components or consume them directly per domain.
- Audit PrimeNG accessibility behavior for key controls before production adoption.
