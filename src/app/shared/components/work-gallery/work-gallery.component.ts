import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  NgZone,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';
import { LanguageService } from '../../../core/services/language.service';

export interface GalleryItem {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  caption: string;
  category: string;
  categoryName?: string;
  categoryId?: number | string;
}

export interface GalleryCategory {
  id: number | string;
  name: string;
  name_en?: string;
  name_pb?: string;
}

@Component({
  selector: 'app-work-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './work-gallery.component.html',
  styleUrls: ['./work-gallery.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
})
export class WorkGallery implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private languageService = inject(LanguageService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  // Active filter tab (matches category id, 'all' by default)
  activeFilter: number | string = 'all';

  // Loading state
  isLoading = false;

  // Lightbox state
  lightboxOpen = false;
  lightboxIndex = 0;

  // Slider state
  currentSlide = 0;
  readonly itemsPerSlide = 3;

  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;
  private langSub?: Subscription;

  categories: GalleryCategory[] = [
    { id: 'all', name: 'All' }
  ];

  items: GalleryItem[] = [];

  get filteredItems(): GalleryItem[] {
    if (this.activeFilter === 'all') {
      return this.items;
    }
    return this.items.filter(i =>
      String(i.categoryId) === String(this.activeFilter) ||
      i.category.toLowerCase() === String(this.activeFilter).toLowerCase()
    );
  }

  get totalSlides(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerSlide);
  }

  get visibleItems(): GalleryItem[] {
    const start = this.currentSlide * this.itemsPerSlide;
    return this.filteredItems.slice(start, start + this.itemsPerSlide);
  }

  ngOnInit(): void {
    this.startAutoSlide();
    this.langSub = this.languageService.currentLang$.subscribe(() => {
      this.loadGalleryData();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    this.langSub?.unsubscribe();
  }

  loadGalleryData(): void {
    this.isLoading = true;
    const isPb = this.languageService.getCurrentLang() === 'pb';
    const languageId = isPb ? 2 : 1;

    this.api.get<any>('/front/work-gallery', { language_id: languageId }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success && res.data) {
          const data = res.data;

          if (Array.isArray(data.categories) && data.categories.length > 0) {
            this.categories = data.categories.map((c: any) => ({
              id: c.id,
              name: c.name,
              name_en: c.name_en,
              name_pb: c.name_pb,
            }));
          }

          if (Array.isArray(data.items)) {
            this.items = data.items.map((i: any) => ({
              id: i.id,
              imageUrl: i.imageUrl || i.image_url,
              altText: i.altText || i.alt_text || i.title,
              title: i.title,
              caption: i.caption,
              category: i.category,
              categoryName: i.category_name || i.category,
              categoryId: i.category_id,
            }));
          }

          if (!this.categories.some(c => String(c.id) === String(this.activeFilter))) {
            this.activeFilter = 'all';
          }
          this.currentSlide = 0;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load work gallery data:', err);
        this.cdr.markForCheck();
      }
    });
  }

  setFilter(cat: GalleryCategory): void {
    this.activeFilter = cat.id;
    this.currentSlide = 0;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  prevSlide(): void {
    if (this.totalSlides > 1) {
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    }
  }

  nextSlide(): void {
    if (this.totalSlides > 1) {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  startAutoSlide(): void {
    if (this.autoSlideInterval) return;
    this.ngZone.runOutsideAngular(() => {
      this.autoSlideInterval = setInterval(() => {
        if (this.totalSlides > 1) {
          this.nextSlide();
          this.cdr.markForCheck();
        }
      }, 5000);
    });
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  // Lightbox
  openLightbox(visibleIndex: number): void {
    const targetIndex = this.currentSlide * this.itemsPerSlide + visibleIndex;
    if (targetIndex >= 0 && targetIndex < this.filteredItems.length) {
      this.lightboxIndex = targetIndex;
      this.lightboxOpen = true;
      this.stopAutoSlide();
      document.body.classList.add('overflow-hidden');
    }
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.classList.remove('overflow-hidden');
    this.startAutoSlide();
  }

  lightboxPrev(): void {
    if (this.filteredItems.length > 0) {
      this.lightboxIndex = (this.lightboxIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
    }
  }

  lightboxNext(): void {
    if (this.filteredItems.length > 0) {
      this.lightboxIndex = (this.lightboxIndex + 1) % this.filteredItems.length;
    }
  }

  get lightboxItem(): GalleryItem | null {
    return this.filteredItems[this.lightboxIndex] ?? null;
  }

  slideEnd(): number {
    return Math.min(this.currentSlide * this.itemsPerSlide + this.itemsPerSlide, this.filteredItems.length);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape')     this.closeLightbox();
    if (e.key === 'ArrowLeft')  this.lightboxPrev();
    if (e.key === 'ArrowRight') this.lightboxNext();
  }
}
