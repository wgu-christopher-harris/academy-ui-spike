# PrimeNG component configs

This folder holds Academy-specific PrimeNG design token configs for individual components.

Use this pattern when adding new component theming:

1. Create one file per component, named `academy-<component>.config.ts`.
2. Export a typed design token object from that file.
3. Keep visual styling in the PrimeUIX / PrimeNG design token layer.
4. Use PassThrough only for DOM structure, attributes, or stable selectors.
5. Re-export new component configs from `components/index.ts`.
6. Wire the config into `academy-primeng.preset.ts` under `components`.

Guidelines:

- Prefer CSS custom properties from the Academy theme, not hard-coded hex values.
- Mirror the Figma design system as closely as the token API allows.
- Keep shared defaults centralized so app code does not need to repeat component theming.
- If a component needs special CSS, keep it inside the config `css()` output unless it truly belongs in a global stylesheet.

Current example:

- `academy-buttons.config.ts` defines the shared Academy button tokens, states, and base typography.

