import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  imports: [CommonModule, RouterLink],
  templateUrl: './ticker.component.html',
  styleUrl: './ticker.component.scss',
})
export class TickerComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private languageService = inject(LanguageService);

  isPaused = false;
  isLoading = false;
  tickerItems: TickerItem[] = [];

  ngOnInit(): void {
    this.loadTickerItems();
  }

  loadTickerItems(): void {
    this.isLoading = true;
    this.api.get<any>('/front/ticker').subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const isPb = this.languageService.getCurrentLang() === 'pb';
          this.tickerItems = res.data.map((item: any) => ({
            id: item.id,
            title: (isPb && item.title_pb) ? item.title_pb : item.title,
            title_pb: item.title_pb,
            date: item.date || item.raw_date || '',
            url: item.url || item.file_url || '/notice',
            file_url: item.file_url,
            external: Boolean(item.external || (item.url && item.url.startsWith('http')))
          }));
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

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }
}
