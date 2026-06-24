# ADR 0009: Split Independently Deployed Experiences into Nx Applications

## Status

Proposed.

## Context

The current student portal has enrollment heavily intertwined with the rest of the application. That creates coordination and deployment friction for an enrollment team that needs to release independently from the broader learner platform.

Nx documentation separates two important ideas:

- Project dependency rules organize and constrain code sharing through applications and libraries.
- Independent deployment requires independently deployable applications, not only lazy-loaded routes inside one application.

Nx's affected command uses Git history and the project graph to identify changed projects and downstream dependents, then runs tasks only for that subset. Nx Release also supports independently released projects through `release.projectsRelationship = "independent"`.

Module Federation can support independently deployed micro frontends, but it adds runtime composition, version negotiation, shared-library mismatch risk, and host/remote operational complexity. This rewrite should avoid that complexity unless a future requirement explicitly demands a single-SPA runtime across independently deployed domains.

References:

- https://nx.dev/docs/concepts/decisions/project-dependency-rules
- https://nx.dev/docs/features/ci-features/affected
- https://nx.dev/docs/guides/nx-release/release-projects-independently

## Decision

Model deployable product surfaces as Nx applications. Model reusable code as Nx libraries.

Enrollment must be its own Nx application because it has an explicit independent deployment requirement.

Do not use Module Federation for the initial architecture. Independent deployment will be achieved through separate Nx application projects, separate build artifacts, app-specific CI/CD deployment steps, and shared libraries governed by Nx dependency rules.

Recommended initial application boundary:

```text
apps/
  academy-shell/
  enrollment/
  student-portal/
```

`academy-shell` stays because it is the root application users can hit at runtime. It owns the Academy entry experience, global route decisions, and links into independently deployed applications. It does not host `enrollment` or `student-portal` code through Module Federation.

Recommended shared library boundary:

```text
libs/
  enrollment/
    feature-shell/
    feature-checkout/
    data-access/
    state/
    ui/
    util/
  learner/
    dashboard/
    course/
    pacing/
    resources/
    communities/
  self-service/
  settings/
  help/
  platform/
    auth/
    config/
    feature-flags/
    http/
    logging/
    observability/
    shell/
  shared/
    ui/
    data-access/
    util/
    testing/
```

Use this decision rule:

- If a team must deploy it independently, make it an `apps/*` project.
- If it is reusable implementation detail, make it a `libs/*` project.
- If a library is shared across deployable apps, treat it as a platform contract and keep its API small, stable, and well-tested.

## Runtime Composition

Use standalone Angular applications.

`academy-shell`, `enrollment`, and `student-portal` are each deployed as separate Angular applications. Enrollment is deployed at an enrollment-owned route or subdomain, such as `/enrollment` or `enroll.academy.wgu.edu`.

Navigation from `academy-shell` to `enrollment` or `student-portal` is a full browser navigation. This is the intentional tradeoff that avoids Module Federation while preserving independent deployments.

Benefits:

- Strongest deployment independence.
- Simplest runtime failure model.
- No Module Federation version negotiation.
- Easier rollback.
- Clear app ownership and deployment responsibility.
- CI can validate and deploy only affected applications.

Tradeoffs:

- Cross-app navigation, auth/session continuity, analytics, and shell consistency must be handled explicitly.
- Shared app shell behavior may be duplicated or moved to platform libraries.
- This is not a single Angular runtime across all product domains.

## Recommendation

Start with `academy-shell`, `enrollment`, and `student-portal` as separately deployable Nx Angular applications. A clean standalone app boundary solves the current deployment problem with less runtime complexity than Module Federation. Nx libraries still give us shared `feature`, `ui`, `data-access`, and `util` code without forcing enrollment into the student portal runtime.

If a future requirement demands same-SPA composition, write a new ADR comparing alternatives. Do not introduce Module Federation by default.

## Dependency Rules

Use Nx tags in multiple dimensions:

- `scope:enrollment`
- `scope:student-portal`
- `scope:platform`
- `scope:shared`
- `type:app`
- `type:feature`
- `type:ui`
- `type:data-access`
- `type:state`
- `type:util`

Initial dependency policy:

- Applications may import libraries.
- Applications may not import other applications.
- Feature libraries may import `ui`, `data-access`, `state`, and `util` libraries in the same scope.
- Feature libraries may import approved `platform` and `shared` libraries.
- UI libraries may import `util` and approved design-system/platform UI primitives.
- Data-access libraries may import `platform/http`, `platform/config`, and `util`.
- Shared libraries may not import domain-scoped libraries.
- Enrollment libraries may not import student-portal domain libraries.
- Student portal libraries may not import enrollment domain libraries except through an explicit platform contract if required.

Example ESLint boundary shape:

```json
{
  "depConstraints": [
    {
      "sourceTag": "type:app",
      "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:data-access", "type:state", "type:util"]
    },
    {
      "sourceTag": "scope:enrollment",
      "onlyDependOnLibsWithTags": ["scope:enrollment", "scope:platform", "scope:shared"]
    },
    {
      "sourceTag": "scope:student-portal",
      "onlyDependOnLibsWithTags": ["scope:student-portal", "scope:platform", "scope:shared"]
    },
    {
      "sourceTag": "scope:shared",
      "onlyDependOnLibsWithTags": ["scope:shared"]
    },
    {
      "sourceTag": "scope:platform",
      "onlyDependOnLibsWithTags": ["scope:platform", "scope:shared"]
    }
  ]
}
```

## CI/CD Rules

Use Nx affected commands for validation:

```bash
nx affected -t lint,test,build --base=origin/main --head=HEAD
```

Deploy only affected applications:

```bash
nx show projects --affected --type=app --base=origin/main --head=HEAD
```

For independent releases, configure Nx Release:

```json
{
  "release": {
    "projectsRelationship": "independent",
    "releaseTag": {
      "pattern": "release/{projectName}/{version}"
    }
  }
}
```

Shared library changes must trigger validation for every affected consuming application. Platform/shared library releases should be treated as higher coordination events because they can affect multiple independently deployed apps.

## Consequences

- Enrollment gets a hard runtime and deployment boundary.
- Teams can use the same repo, dependency graph, design system, HTTP utilities, auth utilities, and SignalStore patterns.
- Shared libraries become intentional contracts instead of incidental reuse.
- CI can validate and deploy the minimum affected application set.
- The team must avoid turning `shared` and `platform` into hidden coupling points.

## Follow-Ups

- Define route/subdomain ownership for enrollment.
- Add actual Nx boundary tags once the workspace is generated.
- Add CI workflow that builds and deploys affected apps only.
- Add contract tests for shared platform libraries consumed by multiple apps.
