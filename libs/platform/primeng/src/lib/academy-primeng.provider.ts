import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { providePrimeNG, type PrimeNGConfigType, type ZIndex } from 'primeng/config';
import { academyPrimeNgDefaultConfig } from './academy-primeng.config';

/**
 * Injection token for the final PrimeNG configuration used by the app.
 *
 * This is useful for diagnostics or app/platform services that need to know
 * what merged PrimeNG configuration was supplied at bootstrap.
 */
export const ACADEMY_PRIMENG_CONFIG = new InjectionToken<PrimeNGConfigType>('ACADEMY_PRIMENG_CONFIG');

/**
 * Provides the shared Academy PrimeNG configuration.
 *
 * Apps should call this from their `ApplicationConfig.providers` instead of
 * calling `providePrimeNG` directly. The shared defaults are merged with
 * optional app-level overrides, then passed to PrimeNG's official provider.
 *
 * @param config App-specific PrimeNG overrides for bootstrap-time configuration.
 * @returns Environment providers for Angular application bootstrap.
 */
export function provideAcademyPrimeNg(config: PrimeNGConfigType = {}): EnvironmentProviders {
  const mergedConfig = mergePrimeNgConfig(academyPrimeNgDefaultConfig, config);

  return makeEnvironmentProviders([
    {
      provide: ACADEMY_PRIMENG_CONFIG,
      useValue: mergedConfig,
    },
    providePrimeNG(mergedConfig),
  ]);
}

/**
 * Merges app overrides into the shared PrimeNG defaults.
 *
 * PrimeNG's config object has nested theme options and z-index values. A shallow
 * spread would replace those whole objects, so this function preserves defaults
 * unless an app explicitly overrides a nested value.
 */
function mergePrimeNgConfig(defaults: PrimeNGConfigType, overrides: PrimeNGConfigType): PrimeNGConfigType {
  return {
    ...defaults,
    ...overrides,
    theme: {
      ...(typeof defaults.theme === 'object' ? defaults.theme : {}),
      ...(typeof overrides.theme === 'object' ? overrides.theme : {}),
      options: {
        ...(typeof defaults.theme === 'object' ? defaults.theme.options : {}),
        ...(typeof overrides.theme === 'object' ? overrides.theme.options : {}),
      },
    },
    zIndex: mergeZIndex(defaults.zIndex, overrides.zIndex),
  };
}

/**
 * Merges z-index layers while keeping PrimeNG's required z-index shape intact.
 */
function mergeZIndex(defaults: ZIndex | null | undefined, overrides: ZIndex | null | undefined): ZIndex | undefined {
  if (!defaults && !overrides) {
    return undefined;
  }

  return {
    modal: overrides?.modal ?? defaults?.modal ?? 1100,
    overlay: overrides?.overlay ?? defaults?.overlay ?? 1000,
    menu: overrides?.menu ?? defaults?.menu ?? 1000,
    tooltip: overrides?.tooltip ?? defaults?.tooltip ?? 1100,
  };
}
