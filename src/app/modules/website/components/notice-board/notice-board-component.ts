import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class NoticeBoardComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private languageService = inject(LanguageService);

  isLoading = false;
  tabs: NoticeCategoryTab[] = [];
  activeTabId: number | string | null = null;
  currentNotices: NoticeItem[] = [];
  private langSub?: Subscription;

  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$.subscribe(() => {
      this.loadTabs();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  loadTabs(): void {
    this.isLoading = true;
    const currentLanguage = this.languageService.getCurrentLang() || 'en';
    const isPb = currentLanguage === 'pb';

    this.api.get<any>(`/front/home/${currentLanguage}`).subscribe({
      next: (res) => {
        this.isLoading = false;
        const tabsData = res?.data?.noticeboardTabs || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(tabsData) && tabsData.length > 0) {
          this.tabs = tabsData.map((cat: any) => ({
            id: cat.id,
            name: (isPb && cat.name_pb) ? cat.name_pb : cat.name,
            name_pb: cat.name_pb,
            route: cat.route || '/notice',
            notices: (cat.notices || []).map((n: any) => ({
              id: n.id,
              title: this.cleanTitle((isPb && n.title_pb) ? n.title_pb : n.title),
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
        } else {
          this.tabs = [];
          this.currentNotices = [];
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

  cleanTitle(raw: string): string {
    if (typeof raw === 'string' && raw.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.title || parsed.description || raw;
      } catch (e) {}
    }
    return raw || '';
  }

  get activeRoute(): string {
    const tab = this.tabs.find(t => t.id === this.activeTabId);
    return tab?.route || '/notice';
  }
}