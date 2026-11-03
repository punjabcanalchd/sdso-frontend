
import { Injectable, inject } from '@angular/core';

import {
  CanActivate,
  CanMatch,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { LanguageService } from '../services/language.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanActivate, CanMatch {

  private languageService = inject(LanguageService);
  private router = inject(Router);

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    const lang = segments[0]?.path;
    return !!lang && this.languageService.isValidLanguage(lang);
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | UrlTree {

    const lang = route.paramMap.get('lang');

    // No language prefix means English
    if (!lang) {
      this.languageService.setLanguage('en');
      return true;
    }

    // Check whether language exists
    if (!this.languageService.isValidLanguage(lang)) {
      return this.router.parseUrl('/');
    }

    // Set selected language
    this.languageService.setLanguage(lang);

    return true;
  }
}
