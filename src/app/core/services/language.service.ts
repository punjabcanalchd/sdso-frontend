import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'pb']);
    this.translate.setFallbackLang('en');
  }

  setLanguage(lang: string): void {
    const language = this.isValidLanguage(lang) ? lang : 'en';

    this.currentLangSubject.next(language);
    localStorage.setItem('user_lang', language);

    this.translate.use(language).subscribe();
  }

  changeLanguage(lang: string): void {
    this.setLanguage(lang);
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }

  getCurrentLanguageId(): number {
    return this.getLanguageId(this.getCurrentLang());
  }

  getLanguageId(code: string): number {
    return this.languages.find(l => l.code === code)?.id ?? 1;
  }

  isValidLanguage(lang: string): boolean {
    return this.languages.some(l => l.code === lang);
  }

  getAvailableLanguages(): AppLanguage[] {
    return this.languages;
  }

  initializeLanguage(lang?: string): void {
    const savedLanguage = localStorage.getItem('user_lang');
    const language = lang || savedLanguage || 'en';

    this.setLanguage(language);
  }
}