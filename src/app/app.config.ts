import {
  APP_INITIALIZER,
  ApplicationConfig
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { firstValueFrom }
from 'rxjs';

import { routes }
from './app.routes';

import { AuthService }
from './core/auth/auth.service';

import { authInterceptor }
from './core/interceptors/auth.interceptor';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

export function initializeApp(
  authService: AuthService
) {

  return () => firstValueFrom(
    authService.initAuth()
  );

}

export const appConfig:
ApplicationConfig = {

  providers: [
    provideAnimationsAsync(),
    provideRouter(routes),

    provideHttpClient(

      withInterceptors([
        authInterceptor
      ])

    ),

    {
      provide: APP_INITIALIZER,

      useFactory: initializeApp,

      deps: [AuthService],

      multi: true
    }

  ]

};