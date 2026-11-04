
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';



export interface AppLanguage {
  code: string;
  label: string;
  nativeLabel: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly languages: AppLanguage[] = [
    {
      id: 1,
      code: 'en',
      label: 'English',
      nativeLabel: 'EN'
    },
    {
      id: 2,
      code: 'pb',
      label: 'Punjabi',
      nativeLabel: 'ਪੰ'
    }
  ];

  private currentLangSubject = new BehaviorSubject<string>('en');

  currentLang$ = this.currentLangSubject.asObservable();

  // Set language
  setLanguage(lang: string): void {
    if (!this.isValidLanguage(lang)) {
      lang = 'en';
    }

    if (this.currentLangSubject.value !== lang) {
      this.currentLangSubject.next(lang);
    }
  }

  // Get current language
  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }

  // Get current language ID
  getCurrentLanguageId(): number {
    return this.getLanguageId(this.getCurrentLang());
  }

  // Get language ID by code
  getLanguageId(code: string): number {
    return this.languages.find(l => l.code === code)?.id ?? 1;
  }

  // Validate language
  isValidLanguage(lang: string): boolean {
    return this.languages.some(l => l.code === lang);
  }

  // Change language
  changeLanguage(lang: string): void {
    this.setLanguage(lang);
  }

  // Available languages
  getAvailableLanguages(): AppLanguage[] {
    return this.languages;
  }
}
