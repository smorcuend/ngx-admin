import { NgModule, InjectionToken, Injectable, ErrorHandler } from '@angular/core';
import { environment } from '../environments/environment';
import { init, captureException } from '@sentry/browser';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  production: boolean;
  appTitle: string;
  API_URL: string;
  ___PUBLIC_DSN___: string;
}

export const APP_DI_CONFIG: AppConfig = {
  production: environment.production,
  ___PUBLIC_DSN___: environment.___PUBLIC_DSN___,
  API_URL: environment.API_URL,
  appTitle: 'Angular Admin Boilerplate - Reclamador.es'
};

/* Sentry */
if (APP_DI_CONFIG.production) {
  init({
    dsn: APP_DI_CONFIG.___PUBLIC_DSN___
  });
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    captureException(error.originalError || error);
    throw error;
  }
}
@NgModule({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: APP_DI_CONFIG
    },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ]
})
export class AppConfigModule {}
