# GitHub Pages Independent Deployment POC

## Goal

Prove that Academy frontend applications can be built and published as independent static artifacts without Module Federation.

This proof uses one GitHub Pages site with path-based application hosting:

```text
https://<owner>.github.io/<repo>/enrollment/
https://<owner>.github.io/<repo>/student-portal/
https://<owner>.github.io/<repo>/style-guide/
```

This does not prove separate production domains, auth routing, CDN rules, or final deployment orchestration. It proves the core runtime boundary: each application can be built into its own static output and replaced independently without loading another application's JavaScript bundle.

## GitHub Pages Model

GitHub Pages allows one project Pages site per repository. For this repo, that means the proof should publish a single Pages artifact that contains all app outputs under separate folders.

Recommended published shape:

```text
dist/pages/
  enrollment/
    index.html
    ...
  student-portal/
    index.html
    ...
  style-guide/
    index.html
    ...
```

Each app is still independently built from its own Nx application project:

```text
apps/enrollment       -> dist/apps/enrollment/browser       -> dist/pages/enrollment
apps/student-portal   -> dist/apps/student-portal/browser   -> dist/pages/student-portal
apps/style-guide      -> dist/apps/style-guide/browser      -> dist/pages/style-guide
```

## Application Base Paths

Because GitHub Pages project sites are served under `/<repo>/`, each Angular app must be built with a path-specific base href.

For a repository named `academy-spike`, the builds should use:

```bash
nx build enrollment --configuration=prod --base-href=/academy-spike/enrollment/
nx build student-portal --configuration=prod --base-href=/academy-spike/student-portal/
nx build style-guide --configuration=prod --base-href=/academy-spike/style-guide/
```

If the repository name changes, replace `academy-spike` in each `--base-href` value.

## Manual Proof

Use this flow for the first proof before automating anything:

1. Build all three applications with their GitHub Pages base href.
2. Copy each `browser` output folder into its matching `dist/pages/<app>` folder.
3. Publish `dist/pages` to GitHub Pages.
4. Open each app URL.
5. Make a visible change only in one app.
6. Rebuild only that app.
7. Replace only that app's folder under `dist/pages`.
8. Publish again and confirm the changed app updated while the other two app URLs still work.

The key observation is that the deployed page for one app should not request a remote bundle from another app. Cross-app movement should be normal URL navigation, not Module Federation runtime composition.

## GitHub Actions POC Workflow

Create `.github/workflows/pages-poc.yml` with this shape when ready to automate the proof:

```yaml
name: GitHub Pages POC

on:
  workflow_dispatch:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build enrollment
        run: npx nx build enrollment --configuration=prod --base-href=/${{ github.event.repository.name }}/enrollment/

      - name: Build student portal
        run: npx nx build student-portal --configuration=prod --base-href=/${{ github.event.repository.name }}/student-portal/

      - name: Build style guide
        run: npx nx build style-guide --configuration=prod --base-href=/${{ github.event.repository.name }}/style-guide/

      - name: Assemble Pages artifact
        run: |
          mkdir -p dist/pages/enrollment dist/pages/student-portal dist/pages/style-guide
          cp -R dist/apps/enrollment/browser/. dist/pages/enrollment/
          cp -R dist/apps/student-portal/browser/. dist/pages/student-portal/
          cp -R dist/apps/style-guide/browser/. dist/pages/style-guide/

      - name: Add fallback pages
        run: |
          cp dist/pages/enrollment/index.html dist/pages/enrollment/404.html
          cp dist/pages/student-portal/index.html dist/pages/student-portal/404.html
          cp dist/pages/style-guide/index.html dist/pages/style-guide/404.html

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist/pages

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Proving Independent Updates

After the first Pages deployment works, prove independent updates with three commits or three manual workflow runs:

1. Change visible text or styling only in `apps/enrollment`.
2. Confirm the workflow rebuilds and republishes the Pages artifact.
3. Open `/enrollment/` and confirm the change is present.
4. Open `/student-portal/` and `/style-guide/` and confirm they still work without code changes.
5. Repeat the same pattern for `apps/student-portal` and `apps/style-guide`.

GitHub Pages still deploys one combined static artifact for the repository. The proof is not that GitHub Pages has three independent sites. The proof is that each Nx app produces a separate deployable static folder that can be replaced independently inside the published artifact.

## Acceptance Criteria

- `enrollment`, `student-portal`, and `style-guide` each load from their own GitHub Pages path.
- Each app's built assets are requested from its own path-prefixed folder.
- Changing one app does not require source changes in the other apps.
- No deployed app requests Module Federation artifacts such as `remoteEntry.js`.
- Cross-app navigation, when introduced, uses configured URLs or normal anchors rather than importing another app.

## Known Limitations

- GitHub Pages project hosting gives one site per repository, so this is a path-based deployment proof.
- Pages does not model final production ingress, auth/session routing, CDN headers, or BFF routing.
- This workflow builds all three apps for simplicity. A later workflow can use Nx affected project detection or path filters to build only changed apps before assembling the final Pages artifact.
- Direct deep links may need app-specific fallback handling. The `404.html` copies above are enough for a basic static-hosting POC, but production hosting should configure SPA fallback rules explicitly.
