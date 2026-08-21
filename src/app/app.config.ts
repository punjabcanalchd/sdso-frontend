import {
  APP_INITIALIZER,
  ApplicationConfig
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors,
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


// export function translateLoaderFactory(
//   http: HttpClient
// ) {
//   return new TranslateHttpLoader(
//     http,
//     './assets/i18n/',
//     '.json'
//   );
// }


export function initializeApp(
  authService: AuthService
) {
  return () => firstValueFrom(
    authService.initAuth()
  );
}


export const appConfig: ApplicationConfig = {

  providers: [

     provideAnimationsAsync(),

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),

   provideTranslateService({
    loader: provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  }),

    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }


  ]

};