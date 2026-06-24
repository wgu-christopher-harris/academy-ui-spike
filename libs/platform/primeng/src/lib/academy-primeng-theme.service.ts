import { inject, Injectable } from '@angular/core';
import {
  updatePreset,
  updatePrimaryPalette,
  updateSurfacePalette,
  usePreset,
} from '@primeuix/themes';
import type { PaletteDesignToken, Preset } from '@primeuix/themes/types';
import { PrimeNG, type PrimeNGConfigType } from 'primeng/config';

/**
 * Runtime facade for PrimeNG theme and configuration changes.
 *
 * Bootstrap-time defaults belong in `provideAcademyPrimeNg`. This service is for
 * user- or app-driven changes after bootstrap, such as toggling dark mode or
 * changing token palettes without reloading the application.
 */
@Injectable({
  providedIn: 'root',
})
export class AcademyPrimeNgThemeService {
  private readonly primeNg = inject(PrimeNG);

  /**
   * Applies PrimeNG config at runtime through PrimeNG's official `setConfig` API.
   *
   * Use this for runtime config changes that are not covered by the more focused
   * helper methods below.
   */
  setConfig(config: PrimeNGConfigType): void {
    this.primeNg.setConfig(config);
  }

  /**
   * Replaces the active PrimeNG preset at runtime.
   *
   * This is the broadest theme switch and should be used when moving to a
   * different preset structure entirely.
   */
  usePreset(...presets: Preset[]): void {
    usePreset(...presets);
  }

  /**
   * Merges token changes into the active PrimeNG preset.
   *
   * Prefer this when only a subset of tokens should change.
   */
  updatePreset(...presets: Preset[]): void {
    updatePreset(...presets);
  }

  /**
   * Updates the semantic primary palette used by PrimeNG components.
   */
  updatePrimaryPalette(palette: PaletteDesignToken): void {
    updatePrimaryPalette(palette);
  }

  /**
   * Updates the surface palette used by PrimeNG components.
   */
  updateSurfacePalette(palette: PaletteDesignToken): void {
    updateSurfacePalette(palette);
  }

  /**
   * Toggles the CSS class PrimeNG is configured to use for dark mode tokens.
   *
   * The default class must stay aligned with `darkModeSelector` in the shared
   * PrimeNG config.
   */
  toggleDarkMode(enabled: boolean, className = 'academy-dark'): void {
    document.documentElement.classList.toggle(className, enabled);
  }
}
