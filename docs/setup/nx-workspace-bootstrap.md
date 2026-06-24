# Nx Workspace Bootstrap

## Goal

Create the initial Nx workspace for the WGU Academy rewrite with three independently deployable Angular applications:

- `academy-shell`
- `enrollment`
- `student-portal`

Reusable implementation should live in Nx libraries tagged by scope and type.

## Source References

- Nx existing project setup: https://nx.dev/docs/getting-started/start-with-existing-project
- Nx workspace creation: https://nx.dev/docs/reference/create-nx-workspace
- Nx Angular generators: https://nx.dev/docs/technologies/angular/generators
- Nx Angular plugin: https://nx.dev/docs/technologies/angular/introduction
- Nx module boundaries: https://nx.dev/docs/features/enforce-module-boundaries

## Recommended Path for This Repo

This repo already contains docs and local config, so initialize Nx in place instead of creating a new folder.

```bash
npx nx@latest init
npx nx add @nx/angular
```

Then generate the three application projects:

```bash
nx g @nx/angular:application apps/academy-shell \
  --standalone=true \
  --routing=true \
  --style=scss \
  --addTailwind=true \
  --prefix=acad \
  --port=4200 \
  --unitTestRunner=none \
  --e2eTestRunner=none \
  --skipTests=true \
  --tags=scope:academy-shell,type:app

nx g @nx/angular:application apps/enrollment \
  --standalone=true \
  --routing=true \
  --style=scss \
  --addTailwind=true \
  --prefix=acad-enroll \
  --port=4201 \
  --unitTestRunner=none \
  --e2eTestRunner=none \
  --skipTests=true \
  --tags=scope:enrollment,type:app

nx g @nx/angular:application apps/student-portal \
  --standalone=true \
  --routing=true \
  --style=scss \
  --addTailwind=true \
  --prefix=acad-student \
  --port=4202 \
  --unitTestRunner=none \
  --e2eTestRunner=none \
  --skipTests=true \
  --tags=scope:student-portal,type:app
```

## Alternative: Brand-New Workspace

If starting from an empty directory instead, create a basic integrated workspace first:

```bash
npx create-nx-workspace@latest academy-spike \
  --preset=apps \
  --workspaceType=integrated \
  --packageManager=npm \
  --nxCloud=skip \
  --interactive=false

cd academy-spike
nx add @nx/angular
```

Then run the same application generators.

## Foundational Libraries

Start with a small set of libraries. Add more only when the app code needs them.

```bash
nx g @nx/angular:library libs/enrollment/feature-shell \
  --name=enrollment-feature-shell \
  --importPath=@academy/enrollment/feature-shell \
  --standalone=true \
  --routing=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:enrollment,type:feature

nx g @nx/angular:library libs/enrollment/data-access \
  --name=enrollment-data-access \
  --importPath=@academy/enrollment/data-access \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:enrollment,type:data-access

nx g @nx/angular:library libs/enrollment/state \
  --name=enrollment-state \
  --importPath=@academy/enrollment/state \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:enrollment,type:state

nx g @nx/angular:library libs/enrollment/ui \
  --name=enrollment-ui \
  --importPath=@academy/enrollment/ui \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:enrollment,type:ui

nx g @nx/angular:library libs/platform/auth \
  --name=platform-auth \
  --importPath=@academy/platform/auth \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:platform,type:util

nx g @nx/angular:library libs/platform/http \
  --name=platform-http \
  --importPath=@academy/platform/http \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:platform,type:data-access

nx g @nx/angular:library libs/platform/config \
  --name=platform-config \
  --importPath=@academy/platform/config \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:platform,type:util

nx g @nx/angular:library libs/shared/ui \
  --name=shared-ui \
  --importPath=@academy/shared/ui \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:shared,type:ui

nx g @nx/angular:library libs/shared/util \
  --name=shared-util \
  --importPath=@academy/shared/util \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:shared,type:util

nx g @nx/angular:library libs/shared/testing \
  --name=shared-testing \
  --importPath=@academy/shared/testing \
  --standalone=true \
  --style=scss \
  --unitTestRunner=none \
  --skipTests=true \
  --tags=scope:shared,type:testing
```

Use explicit `--name` and `--importPath` for every library. Without that, libraries named only by their leaf folder, such as `ui` or `data-access`, will collide when multiple domains add the same library type.

Delay learner, settings, self-service, and help libraries until those application slices are being built. Avoid empty architecture folders.

## Dependencies

Install the agreed frontend stack after the apps are generated:

```bash
npm install primeng @primeuix/themes primeicons tailwindcss-primeui @ngrx/signals @ngrx/operators
npm install -D tailwindcss @tailwindcss/postcss postcss
```

Keep Angular, Nx, PrimeNG, Tailwind, and NgRx versions compatible as a single upgrade unit.

## PrimeNG Provider

PrimeNG is configured through a shared platform provider instead of directly in each app.

Shared provider:

```ts
import { provideAcademyPrimeNg } from '@academy/platform/primeng';
```

Each app registers it in `app.config.ts`:

```ts
providers: [
  provideAcademyPrimeNg(),
]
```

App-level overrides can be passed at bootstrap:

```ts
provideAcademyPrimeNg({
  ripple: false,
  inputVariant: 'filled',
});
```

Runtime theme/config changes are centralized in `AcademyPrimeNgThemeService`:

```ts
const theme = inject(AcademyPrimeNgThemeService);

theme.toggleDarkMode(true);
theme.updatePrimaryPalette({
  500: '#1d4ed8',
});
```

Default PrimeNG setup currently uses the Aura preset, `.academy-dark` as the dark mode selector, and PrimeNG CSS layers.

Tailwind v4 setup:

- Root PostCSS config lives in `.postcssrc.json`.
- Shared Tailwind entry lives in `libs/shared/styles/tailwind.css`.
- Each app has its own `src/styles.css` that imports the shared Tailwind stylesheet and declares app/library `@source` paths.
- Per-app `tailwind.config.js` files are intentionally not used for v4.

Current shared Tailwind entry:

```css
@import "tailwindcss";
@import "tailwindcss-primeui";
```

## Angular Environments

Angular app configuration follows Nx's ESBuild guidance: browser-safe values are exposed through the build target's `define` option and consumed through the typed `@academy/platform/config` library.

Supported environments:

- `local`
- `dev`
- `stage`
- `prod`

Each app has matching build and serve configurations:

```bash
nx serve enrollment --configuration=local
nx serve enrollment --configuration=dev
nx serve enrollment --configuration=stage
nx serve enrollment --configuration=prod

nx build enrollment --configuration=local
nx build enrollment --configuration=dev
nx build enrollment --configuration=stage
nx build enrollment --configuration=prod
```

Default behavior:

- `serve` defaults to `local`.
- `build` defaults to `prod`.

Local BFF config currently points to:

```text
http://localhost:3010
```

Deployed environments use same-origin BFF paths:

```text
/api
/auth
```

That means environment ingress should route `/api` and `/auth` to the BFF in `dev`, `stage`, and `prod`.

Only browser-safe values belong in Angular `define` configuration. Do not put secrets, private keys, tokens, or service credentials in frontend environment values.

## Boundary Rules

After project generation, configure `@nx/enforce-module-boundaries` in `eslint.config.mjs`.

Initial policy:

- Applications may import libraries.
- Applications may not import other applications.
- `scope:enrollment` may depend only on `scope:enrollment`, `scope:platform`, and `scope:shared`.
- `scope:student-portal` may depend only on `scope:student-portal`, `scope:platform`, and `scope:shared`.
- `scope:academy-shell` may depend only on `scope:academy-shell`, `scope:platform`, and `scope:shared`.
- `scope:shared` may depend only on `scope:shared`.
- `scope:platform` may depend only on `scope:platform` and `scope:shared`.

Example:

```js
'@nx/enforce-module-boundaries': [
  'error',
  {
    allow: [],
    depConstraints: [
      {
        sourceTag: 'type:app',
        onlyDependOnLibsWithTags: [
          'type:feature',
          'type:ui',
          'type:data-access',
          'type:state',
          'type:util',
          'type:testing',
        ],
      },
      {
        sourceTag: 'scope:enrollment',
        onlyDependOnLibsWithTags: ['scope:enrollment', 'scope:platform', 'scope:shared'],
      },
      {
        sourceTag: 'scope:student-portal',
        onlyDependOnLibsWithTags: ['scope:student-portal', 'scope:platform', 'scope:shared'],
      },
      {
        sourceTag: 'scope:academy-shell',
        onlyDependOnLibsWithTags: ['scope:academy-shell', 'scope:platform', 'scope:shared'],
      },
      {
        sourceTag: 'scope:platform',
        onlyDependOnLibsWithTags: ['scope:platform', 'scope:shared'],
      },
      {
        sourceTag: 'scope:shared',
        onlyDependOnLibsWithTags: ['scope:shared'],
      },
    ],
  },
]
```

## Verification

After generation:

```bash
nx show projects
nx graph
nx run-many -t lint,test,build
nx show projects --affected --type=app --base=origin/main --head=HEAD
```

The last command is the basis for deploying only affected applications in CI.

## Local Development Workflow

Because this architecture avoids Module Federation, `academy-shell` does not dynamically load `enrollment` or `student-portal` code at runtime. It is a standalone Angular application that users can hit as the Academy root experience. It owns top-level navigation or routing decisions and links into the other independently served applications.

Each application can be developed by itself:

```bash
nx serve enrollment --port=4201
nx serve student-portal --port=4202
nx serve academy-shell --port=4200
```

Recommended local ports:

- `academy-shell`: `http://localhost:4200`
- `enrollment`: `http://localhost:4201`
- `student-portal`: `http://localhost:4202`

For daily feature work, developers should usually run only the application they are changing:

```bash
nx serve enrollment --port=4201
```

When testing cross-app navigation, run the apps together:

```bash
nx run-many -t serve -p academy-shell enrollment student-portal --parallel=3
```

If generated serve targets all default to the same port, configure app-specific default ports in each application's project config or pass `--port` explicitly.

The shell should read the other app URLs from environment/config values, not hard-code production URLs in components. Local defaults can point to localhost:

```ts
export const localAppUrls = {
  enrollment: 'http://localhost:4201',
  studentPortal: 'http://localhost:4202',
};
```

Production and deployed lower environments should use environment-specific URLs, such as:

```text
https://academy.wgu.edu/
https://enroll.academy.wgu.edu/
https://student.academy.wgu.edu/
```

Cross-app concerns must be handled as platform contracts:

- Authentication/session continuity belongs in `libs/platform/auth`.
- Runtime config belongs in `libs/platform/config`.
- Shared navigation URL generation belongs in `libs/platform/shell` or `libs/shared/util`.
- Analytics event naming belongs in a shared platform analytics library when introduced.

This keeps local development simple while preserving independent deployment. The tradeoff is that cross-app navigation is a full browser navigation, not in-process Angular routing. If the platform later requires one Angular runtime across every product domain, that would be a separate architecture decision and would change the deployment tradeoffs.
