import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAcademyAppConfig } from '@academy/platform/config';
import { provideAcademyPrimeNg } from '@academy/platform/primeng';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAcademyAppConfig(),
    provideAcademyPrimeNg(),
    provideRouter(appRoutes),
  ],
};
