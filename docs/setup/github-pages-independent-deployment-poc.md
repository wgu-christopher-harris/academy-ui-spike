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

GitHub Pages allows one project Pages site per repository. For this repo, use `Deploy from a branch` and publish the root of a `gh-pages` branch.

Published branch shape:

```text
gh-pages branch
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
apps/enrollment       -> dist/apps/enrollment/browser       -> gh-pages/enrollment
apps/student-portal   -> dist/apps/student-portal/browser   -> gh-pages/student-portal
apps/style-guide      -> dist/apps/style-guide/browser      -> gh-pages/style-guide
```

GitHub Pages settings:

```text
Source: Deploy from a branch
Branch: gh-pages
Folder: /
```

## Application Base Paths

Because GitHub Pages project sites are served under `/<repo>/`, each Angular app must be built with a path-specific base href.

For a repository named `academy-spike`, the builds should use:

```bash
nx build enrollment --configuration=prod,github-pages
nx build student-portal --configuration=prod,github-pages
nx build style-guide --configuration=prod,github-pages
```

Each app's `github-pages` build configuration owns the app-specific `baseHref`. If the repository name changes, update those `baseHref` values in each app's `project.json`.

## Manual Proof

Use this flow for the first proof before automating anything:

1. Build all three applications with the `prod,github-pages` configuration.
2. Copy each `browser` output folder into its matching app folder on the `gh-pages` branch.
3. Push the `gh-pages` branch.
4. Open each app URL.
5. Make a visible change only in one app.
6. Rebuild only that app.
7. Replace only that app's folder on the `gh-pages` branch.
8. Push `gh-pages` again and confirm the changed app updated while the other two app URLs still work.

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
  contents: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy-affected-apps:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ github.token }}
    steps:
      - name: Checkout source
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Check for existing Pages branch
        id: pages-branch
        run: |
          if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
            echo "exists=true" >> "$GITHUB_OUTPUT"
          else
            echo "exists=false" >> "$GITHUB_OUTPUT"
          fi

      - name: Checkout Pages branch
        if: steps.pages-branch.outputs.exists == 'true'
        uses: actions/checkout@v6
        with:
          ref: gh-pages
          path: gh-pages

      - name: Initialize Pages branch
        if: steps.pages-branch.outputs.exists != 'true'
        run: |
          mkdir gh-pages
          git -C gh-pages init
          git -C gh-pages checkout --orphan gh-pages
          git -C gh-pages remote add origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
          git -C gh-pages config user.name "github-actions[bot]"
          git -C gh-pages config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Configure Pages branch git user
        if: steps.pages-branch.outputs.exists == 'true'
        run: |
          git -C gh-pages config user.name "github-actions[bot]"
          git -C gh-pages config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Determine affected deployable apps
        id: affected-apps
        run: |
          DEPLOYABLE_APPS="enrollment student-portal style-guide"

          if [ "${{ steps.pages-branch.outputs.exists }}" != "true" ]; then
            echo "apps=${DEPLOYABLE_APPS}" >> "$GITHUB_OUTPUT"
            exit 0
          fi

          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "apps=${DEPLOYABLE_APPS}" >> "$GITHUB_OUTPUT"
            exit 0
          fi

          BASE_SHA="${{ github.event.before }}"
          ZERO_SHA="0000000000000000000000000000000000000000"

          if [ -z "$BASE_SHA" ] || [ "$BASE_SHA" = "$ZERO_SHA" ]; then
            echo "apps=${DEPLOYABLE_APPS}" >> "$GITHUB_OUTPUT"
            exit 0
          fi

          AFFECTED_APPS=$(npx nx show projects --affected --type=app --base="$BASE_SHA" --head="${{ github.sha }}" | grep -E '^(enrollment|student-portal|style-guide)$' | xargs || true)

          echo "apps=${AFFECTED_APPS}" >> "$GITHUB_OUTPUT"

      - name: Build affected apps
        if: steps.affected-apps.outputs.apps != ''
        run: |
          for app in ${{ steps.affected-apps.outputs.apps }}; do
            npx nx build "$app" --configuration=prod,github-pages
          done

      - name: Replace affected app folders
        if: steps.affected-apps.outputs.apps != ''
        run: |
          touch gh-pages/.nojekyll

          for app in ${{ steps.affected-apps.outputs.apps }}; do
            rm -rf "gh-pages/${app}"
            mkdir -p "gh-pages/${app}"
            cp -R "dist/apps/${app}/browser/." "gh-pages/${app}/"
            cp "gh-pages/${app}/index.html" "gh-pages/${app}/404.html"
          done

      - name: Publish affected app folders
        if: steps.affected-apps.outputs.apps != ''
        run: |
          git -C gh-pages add .

          if git -C gh-pages diff --cached --quiet; then
            echo "No Pages changes to publish."
            exit 0
          fi

          git -C gh-pages commit -m "Deploy affected apps: ${{ steps.affected-apps.outputs.apps }}"
          git -C gh-pages push origin HEAD:gh-pages

      - name: Report no affected apps
        if: steps.affected-apps.outputs.apps == ''
        run: echo "No deployable app projects were affected."
```

## Proving Independent Updates

After the first Pages deployment works, prove independent updates with three commits or three manual workflow runs:

1. Change visible text or styling only in `apps/enrollment`.
2. Confirm the workflow rebuilds `enrollment` only and replaces only `gh-pages/enrollment`.
3. Open `/enrollment/` and confirm the change is present.
4. Open `/student-portal/` and `/style-guide/` and confirm they still work without code changes.
5. Repeat the same pattern for `apps/student-portal` and `apps/style-guide`.

GitHub Pages still serves one repository site. The proof is not that GitHub Pages has three independent sites. The proof is that each Nx app produces a separate deployable static folder and Nx affected selects the smallest correct set of app folders to rebuild and replace.

## Acceptance Criteria

- `enrollment`, `student-portal`, and `style-guide` each load from their own GitHub Pages path.
- Each app's built assets are requested from its own path-prefixed folder.
- Changing one app does not require source changes in the other apps.
- No deployed app requests Module Federation artifacts such as `remoteEntry.js`.
- Cross-app navigation, when introduced, uses configured URLs or normal anchors rather than importing another app.

## Known Limitations

- GitHub Pages project hosting gives one site per repository, so this is a path-based deployment proof.
- Pages does not model final production ingress, auth/session routing, CDN headers, or BFF routing.
- The first run builds all deployable apps because the `gh-pages` branch does not exist yet.
- Manual workflow runs build all deployable apps by default so the branch can be refreshed deliberately.
- Shared or platform library changes can rebuild multiple apps when Nx marks multiple consumers as affected.
- Direct deep links may need app-specific fallback handling. The `404.html` copies above are enough for a basic static-hosting POC, but production hosting should configure SPA fallback rules explicitly.
