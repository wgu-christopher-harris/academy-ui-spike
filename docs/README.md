# WGU Academy Rewrite Documentation

This directory captures product requirements and architecture decisions for the WGU Academy greenfield rewrite spike.

The first-pass documents were derived from the current `acad-student-portal-ui` application, especially its route map, service endpoints, state folders, CI/CD docs, performance notes, and dashboard HTTP call documentation.

## Product Requirements

- [Platform rewrite overview](prd/platform-rewrite-overview.md)
- [Learner dashboard](prd/learner-dashboard.md)
- [Enrollment and checkout](prd/enrollment-and-checkout.md)
- [Course experience](prd/course-experience.md)
- [Student self-service and settings](prd/student-self-service-and-settings.md)
- [Help and support](prd/help-and-support.md)

## Architecture Decisions

- [ADR 0001: Use Angular latest as the frontend framework](adr/0001-use-angular-latest.md)
- [ADR 0002: Use Nx as the workspace and monorepo foundation](adr/0002-use-nx-workspace.md)
- [ADR 0003: Use PrimeNG and Tailwind for the UI foundation](adr/0003-use-primeng-tailwind.md)
- [ADR 0004: Use NgRx SignalStore for feature state](adr/0004-use-ngrx-signalstore.md)
- [ADR 0005: Organize frontend code by product domain](adr/0005-domain-oriented-frontend-architecture.md)
- [ADR 0006: Adopt route-based lazy loading and explicit performance budgets](adr/0006-route-based-performance-strategy.md)
- [ADR 0007: Standardize typed API data access](adr/0007-typed-api-data-access.md)
- [ADR 0008: Establish testing, quality, and security gates](adr/0008-testing-quality-security-gates.md)
- [ADR 0009: Split independently deployed experiences into Nx applications](adr/0009-independent-app-deployment.md)

## Setup Guides

- [Nx workspace bootstrap](setup/nx-workspace-bootstrap.md)
- [GitHub Pages independent deployment POC](setup/github-pages-independent-deployment-poc.md)

## Open Inputs Needed

- Confirm MVP product scope and launch sequencing.
- Confirm backend strategy: existing WordPress/WooCommerce/edX/Salesforce APIs, new BFF, or phased migration.
- Confirm authentication and identity provider details.
- Confirm hosting, deployment, and environment strategy for the rewrite.
- Confirm accessibility target and governance model.
- Confirm analytics, observability, and product experimentation standards.
