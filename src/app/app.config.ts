import {
  APP_INITIALIZER,
  ApplicationConfig
} from '@angular/core';

import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

import { AuthService } from './core/auth/auth.service';

import { authInterceptor } from './core/interceptors/auth.interceptor';

import {
  provideAnimationsAsync
} from '@angular/platform-browser/animations/async';

import {
  provideTranslateService
} from '@ngx-translate/core';

import {
  provideTranslateHttpLoader
} from '@ngx-translate/http-loader';


export function initializeApp(
  authService: AuthService
) {
  return () => firstValueFrom(
    authService.initAuth()
  );
}

import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [

    provideAnimationsAsync(),

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loadingInterceptor

      ])
    ),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
        useHttpBackend: true,
        enforceLoading: true
      }),
      fallbackLang: 'en',
      lang: 'en'
    }),

    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }

  ]

};