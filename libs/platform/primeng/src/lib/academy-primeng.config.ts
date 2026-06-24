import type { PrimeNGConfigType } from 'primeng/config';
import { academyPrimeNgPreset } from './academy-primeng.preset';

/**
 * Shared PrimeNG defaults for all Academy Angular applications.
 *
 * Keep global PrimeNG decisions here so `academy-shell`, `enrollment`, and
 * `student-portal` start from the same component behavior and theme baseline.
 * Individual apps can still pass overrides through `provideAcademyPrimeNg`.
 *
 * The current default is the Academy preset, which wraps PrimeNG's Material
 * preset with Academy design-system color tokens.
 */
export const academyPrimeNgDefaultConfig: PrimeNGConfigType = {
  ripple: true,
  inputVariant: 'outlined',
  overlayAppendTo: 'body',
  theme: {
    preset: academyPrimeNgPreset,
    options: {
      // PrimeNG watches this selector for token changes when app code toggles dark mode.
      darkModeSelector: '.academy-dark',
      // Keep PrimeNG styles in a named cascade layer so app/shared Tailwind styles can be ordered predictably.
      cssLayer: {
        name: 'primeng',
        order: 'theme, base, primeng, utilities',
      },
    },
  },
  zIndex: {
    modal: 1100,
    overlay: 1000,
    menu: 1000,
    tooltip: 1100,
  },
};
