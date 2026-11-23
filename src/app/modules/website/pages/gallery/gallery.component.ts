import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';
import {
  GalleryService,
  GalleryAlbum,
  GalleryCategoryTab,
  GalleryPhoto
} from '../../../../core/services/gallery.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryPageComponent implements OnInit, OnDestroy {
  private galleryService = inject(GalleryService);
  private languageService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  categories: GalleryCategoryTab[] = [];
  albums: GalleryAlbum[] = [];
  selectedCategoryId: number | string = 'all';

  // Lightbox
  selectedAlbum: GalleryAlbum | null = null;
  activePhotoIndex = 0;

  private routeSub?: Subscription;
  private langSub?: Subscription;

  readonly fallbackImage = '/assets/images/placeholder.png';

  get isPb(): boolean {
    return this.languageService.getCurrentLang() === 'pb';
  }

  get breadcrumbs(): BreadcrumbItem[] {
    return [
      { label: this.isPb ? 'ਮੁੱਖ ਪੰਨਾ' : 'Home', route: '/' },
      { label: this.isPb ? 'ਫੋਟੋ ਗੈਲਰੀ' : 'Photo Gallery' },
    ];
  }

  get filteredAlbums(): GalleryAlbum[] {
    if (this.selectedCategoryId === 'all') {
      return this.albums;
    }

    return this.albums.filter(album =>
      String(album.id) === String(this.selectedCategoryId) ||
      (album.public_id && String(album.public_id) === String(this.selectedCategoryId))
    );
  }

  get activePhoto(): GalleryPhoto {
    if (!this.selectedAlbum || !this.selectedAlbum.images.length) {
      return { id: 0, url: this.fallbackImage, alt: 'Photo' };
    }
    return this.selectedAlbum.images[this.activePhotoIndex] || this.selectedAlbum.images[0];
  }

  ngOnInit(): void {
    // Listen to route params (e.g. /media/:id or /gallery/:id)
    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.selectedCategoryId = isNaN(Number(idParam)) ? idParam : Number(idParam);
      }
      this.loadGallery();
    });

    // Reload when language changes
    this.langSub = this.languageService.currentLang$.subscribe(() => {
      this.loadGallery();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.langSub?.unsubscribe();
    this.restoreBodyScroll();
  }

  loadGallery(): void {
    this.isLoading = true;

    this.galleryService.getGalleryData(this.selectedCategoryId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.success && res.data) {
          this.categories = res.data.categories || [];
          this.albums = res.data.albums || [];

          // Verify if requested category exists in loaded categories
          if (this.selectedCategoryId !== 'all') {
            const exists = this.categories.some(c => String(c.id) === String(this.selectedCategoryId));
            if (!exists && this.albums.length === 0) {
              this.selectedCategoryId = 'all';
            }
          }
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load gallery data:', err);
        this.cdr.markForCheck();
      }
    });
  }

  selectCategory(catId: number | string): void {
    this.selectedCategoryId = catId;
    this.cdr.markForCheck();
  }

  openLightbox(album: GalleryAlbum, photoIndex: number = 0): void {
    if (!album.images || album.images.length === 0) {
      // If no sub-images, create one from coverUrl
      album.images = [{
        id: 0,
        url: album.coverUrl || this.fallbackImage,
        alt: album.title,
        title: album.title,
        caption: album.description,
      }];
    }

    this.selectedAlbum = album;
    this.activePhotoIndex = photoIndex;
    this.lockBodyScroll();
    this.cdr.markForCheck();
  }

  closeLightbox(): void {
    this.selectedAlbum = null;
    this.activePhotoIndex = 0;
    this.restoreBodyScroll();
    this.cdr.markForCheck();
  }

  nextPhoto(e?: Event): void {
    if (e) e.stopPropagation();
    if (this.selectedAlbum && this.selectedAlbum.images.length > 0) {
      this.activePhotoIndex = (this.activePhotoIndex + 1) % this.selectedAlbum.images.length;
      this.cdr.markForCheck();
    }
  }

  prevPhoto(e?: Event): void {
    if (e) e.stopPropagation();
    if (this.selectedAlbum && this.selectedAlbum.images.length > 0) {
      this.activePhotoIndex = (this.activePhotoIndex - 1 + this.selectedAlbum.images.length) % this.selectedAlbum.images.length;
      this.cdr.markForCheck();
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== this.fallbackImage) {
      target.onerror = null;
      target.src = this.fallbackImage;
    }
  }

  stripHtml(value?: string | null): string {
    if (!value) return '';
    return value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.selectedAlbum) {
      if (event.key === 'ArrowRight') {
        this.nextPhoto();
      } else if (event.key === 'ArrowLeft') {
        this.prevPhoto();
      } else if (event.key === 'Escape') {
        this.closeLightbox();
      }
    }
  }

  private lockBodyScroll(): void {
    document.body.classList.add('overflow-hidden');
  }

  private restoreBodyScroll(): void {
    document.body.classList.remove('overflow-hidden');
  }
}
