import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, map } from 'rxjs';
import { ApiService } from './api.service';
import { LanguageService } from './language.service';
import { environment } from '../../../environments/environment';

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
  private titleService = inject(Title);

  private settingsSubject = new BehaviorSubject<SiteSettings | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  public logoUrl$ = this.settings$.pipe(map(s => s?.logo || null));
  public headline$ = this.settings$.pipe(map(s => s?.headline || null));
  public logoHeading$ = this.settings$.pipe(map(s => s?.logo_heading || null));
  public logoSubHeading$ = this.settings$.pipe(map(s => s?.logo_sub_heading || null));
  public siteIcon$ = this.settings$.pipe(map(s => s?.site_icon || null));
  public websiteName$ = this.settings$.pipe(map(s => s?.website_name || null));

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
          const settings = res.data.settings;
          this.settingsSubject.next(settings);
          this.updateFavicon(settings.site_icon);
          if (settings.website_name) {
            this.updateTitle(settings.website_name);
          }
        }
      },
      error: (err) => {
        console.error('Failed to load site settings:', err);
      }
    });
  }

  private updateFavicon(iconUrl?: string | null): void {
    const finalUrl = iconUrl ? this.resolveIconUrl(iconUrl) : '/assets/images/front/logo.png';
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = finalUrl.endsWith('.ico') ? 'image/x-icon' : 'image/png';
    link.href = finalUrl;
  }

  private resolveIconUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    const clean = url.replace(/^\/+/, '');
    if (clean.startsWith('uploads/')) {
      return `${environment.baseUrl}/${clean}`;
    }
    const uploadUrl = environment.uploadUrl || `${environment.baseUrl}/uploads`;
    return `${uploadUrl}/${clean}`;
  }

  private updateTitle(name?: string | null): void {
    if (!name) return;
    this.titleService.setTitle(name);
  }

  get currentSettings(): SiteSettings | null {
    return this.settingsSubject.value;
  }
}
