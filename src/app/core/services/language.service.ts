
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

  private currentLangSubject = new BehaviorSubject<string>('en');

  currentLang$ = this.currentLangSubject.asObservable();

  setLanguage(lang: string): void {
    if (this.currentLangSubject.value !== lang) {
      this.currentLangSubject.next(lang);
    }
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }

  getCurrentLanguageId(): number {
    return this.getCurrentLang() === 'pb' ? 2 : 1;
  }

  isValidLanguage(lang: string): boolean {
    return ['en', 'pb', 'hi'].includes(lang);
  }

  changeLanguage(lang: string): void {
    this.setLanguage(lang);
  }

  private readonly availableLanguages = [
    { code: 'en', name: 'English', id: 1 },
    { code: 'pb', name: 'Punjabi', id: 2 },
    // { code: 'hi', name: 'Hindi', id: 3 } // Preserved for future implementation
  ];

  getAvailableLanguages() {
    return this.availableLanguages;
  }


  
}

//   private currentLangSubject = new BehaviorSubject<string>('en');

//   currentLang$ = this.currentLangSubject.asObservable();


//   private readonly languages: AppLanguage[] = [
//     {
//       id: 1,
//       code: 'en',
//       label: 'English',
//       nativeLabel: 'EN'
//     },
//     {
//       id: 2,
//       code: 'pb',
//       label: 'Punjabi',
//       nativeLabel: 'ਪੰ'
//     }
   
//   ];

//   constructor(
//     private translate: TranslateService,
//     private router: Router
//   ) {
//     this.translate.addLangs(
//       this.languages.map(l => l.code)
//     );

//     this.translate.setDefaultLang('en');
//   }

//   // Check whether language exists
//   isValidLanguage(code: string): boolean {
//     return this.languages.some(l => l.code === code);
//   }

//   // Get language from URL
//   getLanguageFromUrl(): string {
//     const firstSegment =
//       this.router.url.split('?')[0]
//         .split('/')[1];

//     if (firstSegment && this.isValidLanguage(firstSegment)) {
//       return firstSegment;
//     }

//     return 'en';
//   }

//   // Set application language
//   setLanguage(lang: string): void {
//     if (!this.isValidLanguage(lang)) {
//       lang = 'en';
//     }

//     this.translate.use(lang);

//     localStorage.setItem('user_lang', lang);
//   }

//   // Change language and update URL
//   changeLanguage(lang: string): void {

//     if (!this.isValidLanguage(lang)) {
//       return;
//     }

//     const currentUrl = this.router.url.split('?')[0];

//     const segments = currentUrl.split('/').filter(Boolean);

//     // Remove existing language prefix
//     if (segments.length && this.isValidLanguage(segments[0])) {
//       segments.shift();
//     }

//     // Add language prefix except English
//     if (lang !== 'en') {
//       segments.unshift(lang);
//     }

//     const newUrl = '/' + segments.join('/');

//     this.setLanguage(lang);

//     this.router.navigateByUrl(newUrl);
//   }

//   getCurrentLang(): string {
//     return this.translate.currentLang || 'en';
//   }

//   getAvailableLanguages(): AppLanguage[] {
//     return this.languages;
//   }

 
// getCurrentLanguageId(): number {
//   const currentLang = this.getCurrentLang();
//   const language = this.languages.find(
//     l => l.code === currentLang
//   );
//   return language?.id ?? 1;
// }



//   getLanguageId(code: string): number {
//     return this.languages.find(
//       l => l.code === code
//     )?.id ?? 1;
//   }

  
// }
