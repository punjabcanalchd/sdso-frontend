import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ApiService } from './api.service';
import { LanguageService } from './language.service';

export interface SiteMinisterInfo {
  logo?: string | null;
  heading?: string;
  sub_heading?: string;
}

export interface SiteSettings {
  logo?: string | null;
  logo_raw?: string | null;
  secondary_logo?: string | null;
  logo_heading?: string;
  logo_heading_en?: string;
  logo_heading_pb?: string;
  logo_sub_heading?: string;
  logo_sub_heading_en?: string;
  logo_sub_heading_pb?: string;
  website_name?: string;
  headline?: string;
  site_icon?: string | null;
  officials_enabled?: boolean;
  chief_minister?: SiteMinisterInfo;
  cabinet_minister?: SiteMinisterInfo;
  raw?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private api = inject(ApiService);
  private languageService = inject(LanguageService);

  private settingsSubject = new BehaviorSubject<SiteSettings | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  public logoUrl$ = this.settings$.pipe(map(s => s?.logo || null));
  public headline$ = this.settings$.pipe(map(s => s?.headline || null));
  public logoHeading$ = this.settings$.pipe(map(s => s?.logo_heading || null));
  public logoSubHeading$ = this.settings$.pipe(map(s => s?.logo_sub_heading || null));

  constructor() {
    this.languageService.currentLang$.subscribe(lang => {
      this.loadSettings(lang);
    });
  }

  loadSettings(lang?: string): void {
    const currentLang = lang || this.languageService.getCurrentLang() || 'en';
    this.api.get<any>(`/front/home/${currentLang}`).subscribe({
      next: (res) => {
        if (res?.success && res.data?.settings) {
          this.settingsSubject.next(res.data.settings);
        }
      },
      error: (err) => {
        console.error('Failed to load site settings:', err);
      }
    });
  }

  get currentSettings(): SiteSettings | null {
    return this.settingsSubject.value;
  }
}
