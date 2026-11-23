import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { GalleryService, GalleryAlbum } from '../../../core/services/gallery.service';
import { LanguageService } from '../../../core/services/language.service';

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface GalleryEvent {
  id: number;
  coverUrl: string; // The image shown on the card
  title: string;
  date: string;
  images: GalleryImage[]; // images shown in the slider
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX({{enterOffset}})' }),
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX({{leaveOffset}})' }))
      ])
    ])
  ]
})
export class GalleryComponent implements OnInit, OnDestroy {
  private galleryService = inject(GalleryService);
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);

  @Input() eventId?: number | string;
  @Input() events: GalleryEvent[] = [];

  selectedEvent: GalleryEvent | null = null;
  activeIndex: number = 0;
  direction: 'next' | 'prev' = 'next';
  isLoading = false;

  readonly fallbackImage = '/assets/images/placeholder.png';

  private autoplayInterval: any;
  private langSub?: Subscription;

  ngOnInit(): void {
    if (this.events.length === 0) {
      this.loadDynamicGallery();
    }

    this.langSub = this.languageService.currentLang$.subscribe(() => {
      this.loadDynamicGallery();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.langSub?.unsubscribe();
    this.restoreBodyScroll();
  }

  loadDynamicGallery(): void {
    this.isLoading = true;
    this.galleryService.getGalleryData(this.eventId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success && Array.isArray(res.data?.albums)) {
          this.events = res.data.albums.map((album: GalleryAlbum) => ({
            id: album.id,
            coverUrl: album.coverUrl || this.fallbackImage,
            title: album.title,
            date: album.date || '',
            images: album.images.length > 0
              ? album.images.map(img => ({
                  url: img.url,
                  alt: img.alt || album.title,
                }))
              : [{
                  url: album.coverUrl || this.fallbackImage,
                  alt: album.title,
                }]
          }));
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load gallery events:', err);
        this.cdr.markForCheck();
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.selectedEvent) {
      if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'Escape') {
        this.closeLightbox();
      }
    }
  }

  openLightbox(event: GalleryEvent): void {
    this.selectedEvent = event;
    this.activeIndex = 0;
    this.direction = 'next';
    this.lockBodyScroll();
    this.startAutoplay();
  }

  closeLightbox(): void {
    this.selectedEvent = null;
    this.restoreBodyScroll();
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayInterval = window.setInterval(() => {
      this.nextImage(undefined, false);
    }, 4000);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      window.clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  nextImage(e?: Event, resetTimer: boolean = true): void {
    if (e) e.stopPropagation();
    if (this.selectedEvent && this.selectedEvent.images.length > 0) {
      this.direction = 'next';
      this.activeIndex = (this.activeIndex + 1) % this.selectedEvent.images.length;
      this.cdr.markForCheck();
    }
    if (resetTimer) this.startAutoplay();
  }

  prevImage(e?: Event): void {
    if (e) e.stopPropagation();
    if (this.selectedEvent && this.selectedEvent.images.length > 0) {
      this.direction = 'prev';
      this.activeIndex = (this.activeIndex - 1 + this.selectedEvent.images.length) % this.selectedEvent.images.length;
      this.cdr.markForCheck();
    }
    this.startAutoplay();
  }

  onImageError(e: Event): void {
    const target = e.target as HTMLImageElement;
    if (target && target.src !== this.fallbackImage) {
      target.onerror = null;
      target.src = this.fallbackImage;
    }
  }

  private lockBodyScroll(): void {
    document.body.classList.add('overflow-hidden');
  }

  private restoreBodyScroll(): void {
    document.body.classList.remove('overflow-hidden');
  }
}
