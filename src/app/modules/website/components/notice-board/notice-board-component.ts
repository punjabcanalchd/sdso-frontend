import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { LanguageService } from '../../../../core/services/language.service';

export interface NoticeItem {
  id?: number;
  title: string;
  title_pb?: string;
  description?: string;
  date: string;
  raw_date?: string;
  url: string;
  file_url?: string;
  external?: boolean;
}

export interface NoticeCategoryTab {
  id: number | string;
  name: string;
  name_pb?: string;
  route: string;
  notices: NoticeItem[];
}

@Component({
  selector: 'app-notice-board',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notice-board-component.html',
  styleUrl: './notice-board-component.scss',
})
export class NoticeBoardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private languageService = inject(LanguageService);

  isLoading = false;
  tabs: NoticeCategoryTab[] = [];
  activeTabId: number | string | null = null;
  currentNotices: NoticeItem[] = [];

  ngOnInit(): void {
    this.loadTabs();
  }

  loadTabs(): void {
    this.isLoading = true;
    this.api.get<any>('/front/noticeboard-tabs').subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const isPb = this.languageService.getCurrentLang() === 'pb';
          this.tabs = res.data.map((cat: any) => ({
            id: cat.id,
            name: (isPb && cat.name_pb) ? cat.name_pb : cat.name,
            name_pb: cat.name_pb,
            route: cat.route || '/notice',
            notices: (cat.notices || []).map((n: any) => ({
              id: n.id,
              title: (isPb && n.title_pb) ? n.title_pb : n.title,
              date: n.date || n.raw_date || '',
              url: n.url || n.file_url || '/notice',
              file_url: n.file_url,
              external: Boolean(n.external || n.file_url)
            }))
          }));

          // Set first tab as active by default
          if (this.tabs.length > 0) {
            this.setTab(this.tabs[0].id);
          }
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load noticeboard tabs:', err);
        this.cdr.markForCheck();
      }
    });
  }

  setTab(tabId: number | string): void {
    this.activeTabId = tabId;
    const tab = this.tabs.find(t => t.id === tabId);
    this.currentNotices = tab?.notices || [];
  }

  get activeRoute(): string {
    const tab = this.tabs.find(t => t.id === this.activeTabId);
    return tab?.route || '/notice';
  }
}