
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


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
    },
    {
      id: 3,
      code: 'hi',
      label: 'Hindi',
      nativeLabel: 'हिं'
    }
  ];

  constructor(private translate: TranslateService) {

    this.translate.addLangs(
      this.languages.map(l => l.code)
    );

    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    const savedLang = localStorage.getItem('user_lang');

    const supportedCodes =
      this.languages.map(l => l.code);

    const initialLang =
      savedLang ||
      (
        browserLang &&
        supportedCodes.includes(browserLang)
          ? browserLang
          : 'en'
      );

    this.translate.use(initialLang);
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('user_lang', lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang || 'en';
  }

  getAvailableLanguages(): AppLanguage[] {
    return this.languages;
  }

  getCurrentLanguageId(): number {
    const language = this.languages.find(
      l => l.code === this.getCurrentLang()
    );

    return language?.id ?? 1;
  }

  getLanguageId(code: string): number {
    const language = this.languages.find(
      l => l.code === code
    );

    return language?.id ?? 1;
  }
}