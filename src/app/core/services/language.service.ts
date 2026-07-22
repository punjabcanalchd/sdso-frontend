import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface AppLanguage {
  code: string;
  label: string;
  nativeLabel: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly languages: AppLanguage[] = [
    { code: 'en', label: 'English',  nativeLabel: 'EN' },
    { code: 'hi', label: 'Hindi',    nativeLabel: 'हिं' },
    { code: 'pa', label: 'Punjabi',  nativeLabel: 'ਪੰ' },
  ];

  constructor(private translate: TranslateService) {
    // Register all supported language codes
    this.translate.addLangs(this.languages.map(l => l.code));

    // Fallback language
    this.translate.setDefaultLang('en');

    // Restore saved preference or detect browser language
    const browserLang = this.translate.getBrowserLang();
    const savedLang = localStorage.getItem('user_lang');
    const supportedCodes = this.languages.map(l => l.code);

    const initialLang = savedLang
      || (browserLang && supportedCodes.includes(browserLang) ? browserLang : 'en');

    this.translate.use(initialLang);
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('user_lang', lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang || 'en';
  }

  /** Returns all available languages — add a new entry here + a JSON file to support more. */
  getAvailableLanguages(): AppLanguage[] {
    return this.languages;
  }


  getCurrentLanguageId(): number {
  switch (this.getCurrentLang()) {
    case 'en':
      return 1;

    case 'pa':
      return 2;

    case 'hi':
      return 3;

    default:
      return 1;
  }
}
}