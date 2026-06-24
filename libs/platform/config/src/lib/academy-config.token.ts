import { InjectionToken, Provider } from '@angular/core';
import { AcademyAppConfig, readAcademyAppConfig } from './academy-app-config';

export const ACADEMY_APP_CONFIG = new InjectionToken<AcademyAppConfig>('ACADEMY_APP_CONFIG');

export function provideAcademyAppConfig(): Provider {
  return {
    provide: ACADEMY_APP_CONFIG,
    useFactory: readAcademyAppConfig,
  };
}
