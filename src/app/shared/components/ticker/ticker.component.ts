import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { LanguageService } from '../../../core/services/language.service';

export interface TickerItem {
  id?: number;
  title: string;
  title_pb?: string;
  date?: string;
  url: string;
  file_url?: string;
  external?: boolean;
}

@Component({
  selector: 'app-ticker',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './ticker.component.html',
  styleUrl: './ticker.component.scss',
})
export class TickerComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private languageService = inject(LanguageService);

  isPaused = false;
  isLoading = false;
  tickerItems: TickerItem[] = [];
  private langSub?: Subscription;

  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$.subscribe(() => {
      this.loadTickerItems();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  loadTickerItems(): void {
    this.isLoading = true;
    const currentLanguage = this.languageService.getCurrentLang() || 'en';
    const isPb = currentLanguage === 'pb';

    this.api.get<any>(`/front/home/${currentLanguage}`).subscribe({
      next: (res) => {
        this.isLoading = false;
        const tickerData = res?.data?.ticker || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(tickerData) && tickerData.length > 0) {
          this.tickerItems = tickerData.map((item: any) => ({
            id: item.id,
            title: this.cleanTitle((isPb && item.title_pb) ? item.title_pb : item.title),
            title_pb: item.title_pb,
            date: item.date || item.raw_date || '',
            url: item.url || item.file_url || '/notice',
            file_url: item.file_url,
            external: Boolean(item.external || (item.url && item.url.startsWith('http')))
          }));
        } else {
          this.tickerItems = [];
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load ticker items from db:', err);
        this.cdr.markForCheck();
      }
    });
  }

  cleanTitle(raw: string): string {
    if (typeof raw === 'string' && raw.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.title || parsed.description || raw;
      } catch (e) { }
    }
    return raw || '';
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }
}
