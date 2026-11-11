  import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, NgZone, ChangeDetectorRef, inject
  } from '@angular/core';

  import { RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { TranslateModule } from '@ngx-translate/core';
  import { ApiService } from '../../../core/services/api.service';
  import { LanguageService } from '../../../core/services/language.service';

  export interface PartnerLogo {
    name: string;
    imageUrl: string;
    linkUrl: string;
  }

  export interface FooterLink {
    label: string;
    url: string;
    external?: boolean;
  }

  export interface FooterColumn {
    title: string;
    links: FooterLink[];
  }

  export interface FooterStats {
    totalVisitors: number | null;
    lastUpdated: string | null;
  }

  export interface CopyrightInfo {
    year: number | string;
    organization: string;
    developed_by: string;
  }

  @Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
  })
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('logoTrack') logoTrack!: ElementRef<HTMLDivElement>;

    private ngZone = inject(NgZone);
    private cdr = inject(ChangeDetectorRef);
    private api = inject(ApiService);
    private languageService = inject(LanguageService);

    currentYear = new Date().getFullYear();

    // ── Dynamic State ────────────────────────────────────────────────────────
    columns: FooterColumn[] = [];
    topLinks: FooterLink[] = [];
    partnerLogos: PartnerLogo[] = [];
    copyright: CopyrightInfo = {
      year: new Date().getFullYear(),
      organization: 'State Dam Safety Organization',
      developed_by: 'Website Designed and Developed by National Informatics Centre (NIC)',
    };
    stats: FooterStats = { totalVisitors: null, lastUpdated: null };

    isLoading = false;
    isPaused = false;

    private autoScrollId: number | null = null;
    private readonly SCROLL_SPEED = 1.2;
    private readonly ARROW_STEP   = 220;

    scrollLogos: PartnerLogo[] = [];

    private updateScrollLogos(): void {
      this.scrollLogos = [...this.partnerLogos, ...this.partnerLogos, ...this.partnerLogos];
    }

    private langSub?: any;

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    ngOnInit(): void {
      this.updateScrollLogos();
      // currentLang$ is a BehaviorSubject that emits immediately upon subscription,
      // which loads footer data once initially and on any language switch.
      this.langSub = this.languageService.currentLang$.subscribe(() => {
        this.loadFooterData();
      });
    }

    ngOnDestroy(): void {
      this.stopAutoScroll();
      this.langSub?.unsubscribe();
    }

    ngAfterViewInit(): void {
      this.ngZone.runOutsideAngular(() => this.startAutoScroll());
    }

    topLinksTitle = 'Policies & Help';

    get isPb(): boolean {
      return this.languageService.getCurrentLang() === 'pb';
    }

    // ── Load Dynamic Data ─────────────────────────────────────────────────────
    loadFooterData(): void {
      this.isLoading = true;
      const isPb = this.languageService.getCurrentLang() === 'pb';
      const languageId = isPb ? 2 : 1;

      this.api.get<any>(`/front/footer?language_id=${languageId}`).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res?.success && res.data) {
            const data = res.data;
            this.columns = data.columns || [];         
            this.topLinks = data.top_links || [];
            this.topLinksTitle = data.top_links_title || (isPb ? 'ਨੀਤੀਆਂ ਅਤੇ ਸਹਾਇਤਾ' : 'Policies & Help');
            this.partnerLogos = data.partner_logos || [];
            if (data.copyright) {
              this.copyright = data.copyright;
            }
            if (data.stats) {
              this.stats = data.stats;
            }
          }
          this.updateScrollLogos();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Failed to load dynamic footer data:', err);
          this.cdr.markForCheck();
        }
      });
    }

    // ── Hover pause ───────────────────────────────────────────────────────────
    onHover(hovered: boolean): void {
      this.isPaused = hovered;
      if (hovered) {
        this.stopAutoScroll();
      } else {
        this.ngZone.runOutsideAngular(() => this.startAutoScroll());
      }
    }

    scrollRight(): void {
      const el = this.logoTrack?.nativeElement;
      if (!el) return;

      this.stopAutoScroll();
      el.scrollBy({ left: this.ARROW_STEP, behavior: 'smooth' });

      setTimeout(() => {
        if (!this.isPaused) {
          this.ngZone.runOutsideAngular(() => this.startAutoScroll());
        }
      }, 450);
    }

    scrollLeft(): void {
      const el = this.logoTrack?.nativeElement;
      if (!el) return;

      this.stopAutoScroll();
      el.scrollBy({ left: -this.ARROW_STEP, behavior: 'smooth' });

      setTimeout(() => {
        if (!this.isPaused) {
          this.ngZone.runOutsideAngular(() => this.startAutoScroll());
        }
      }, 450);
    }

    private startAutoScroll(): void {
      this.stopAutoScroll();
      const tick = () => {
        const el = this.logoTrack?.nativeElement;
        if (!el) return;

        el.scrollLeft += this.SCROLL_SPEED;

        const third = el.scrollWidth / 3;
        if (el.scrollLeft >= third * 2) {
          el.scrollLeft -= third;
        }

        this.autoScrollId = requestAnimationFrame(tick);
      };
      this.autoScrollId = requestAnimationFrame(tick);
    }

    private stopAutoScroll(): void {
      if (this.autoScrollId !== null) {
        cancelAnimationFrame(this.autoScrollId);
        this.autoScrollId = null;
      }
    }
}
