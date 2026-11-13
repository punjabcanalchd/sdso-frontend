import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  NgZone,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FrontendPagesService } from '../../../modules/website/pages/frontend-pages/frontend-pages.service';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { LoaderService } from '../../../core/services/loader.service';


interface BannerSlide {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

@Component({
  selector: 'app-banner-slider',
  standalone: true,
  templateUrl: './banner-slider.component.html',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./banner-slider.component.scss'],
})
export class BannerSlider implements OnInit, OnDestroy {

  currentIndex = 0;
  isHovered = false;
  isAutoPlaying = true;
  isLoading = false;

  slides: BannerSlide[] = [];
  private api = inject(ApiService);

  private loaderService = inject(LoaderService);
  private pendingBannerImages = 0;
  private bannerLoaderActive = false;


  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_PLAY_DELAY = 5000;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private frontendPagesService: FrontendPagesService
  ) {}

  ngOnInit(): void {
    this.loadHomeSliders();
  }

  ngOnDestroy(): void {
      this.stopAutoPlay();
      this.finishBannerLoading();
  }

  // Get slider data from Laravel API
// loadHomeSliders(): void {

//   // this.frontendPagesService.getHomeSliders().subscribe({
//     // next: (response: any) => {

//   const currentLanguage = localStorage.getItem('user_lang') || 'en';

//   this.api.get<any>(`/front/home/${currentLanguage}`).subscribe({
//     next: (res: any) => {

//       console.log('Complete Slider Response:', res);
//       // Extract images from results array
//       const images = res.data?.results || [];
//       // Get selected language
//       const currentLanguage = localStorage.getItem('user_lang') || 'en';
//       //  this.sliderData = res.data?.sliders || [];

//       this.slides = images.map((item: any, index: number) => ({
//         id: item.id,
//         imageUrl: this.getImageUrl(item.image_name),

//          altText: currentLanguage === 'pb'
//           ? (item.title_pb || 'SDSO Banner')
//           : (item.title_en || 'SDSO Banner'),

//          title: currentLanguage === 'pb'
//           ? (item.title_pb || '')
//           : (item.title_en || ''),

//         // subtitle: currentLanguage === 'pb'
//         //   ? (item.description_pb || '')
//         //   : (item.description_en || ''),

//         // subtitle: item.description || '',

//         ctaLabel: item.link ? 'Read More' : '',
//         ctaUrl: item.link || ''
//       }));

//       this.currentIndex = 0;

//       if (this.slides.length > 1 && this.isAutoPlaying) {
//         this.startAutoPlay();
//       }

//       console.log('Mapped Slider Images:', this.slides);

//       this.cdr.detectChanges();

//     },

//     error: (error: any) => {
//       console.error('Slider API Error:', error);
//     }

//   });

// }
loadHomeSliders(): void {

  const currentLanguage = localStorage.getItem('user_lang') || 'en';

  // Keep loader active until all banner images finish loading
  this.loaderService.show('Loading banners...');
  this.bannerLoaderActive = true;

  this.api.get<any>(`/front/home/${currentLanguage}`).subscribe({

    next: (res: any) => {

      console.log('Home API Response:', res);

      const images = res.data?.sliders?.results || [];

      this.pendingBannerImages = images.length;

      this.slides = images.map((item: any) => ({

        id: item.id,

        imageUrl: this.getImageUrl(item.image_name),

        altText: currentLanguage === 'pb'
          ? (item.title_pb || item.title_en || 'SDSO Banner')
          : (item.title_en || item.title_pb || 'SDSO Banner'),

        title: currentLanguage === 'pb'
          ? (item.title_pb || item.title_en || '')
          : (item.title_en || item.title_pb || ''),

        subtitle: '',

        ctaLabel: item.link ? 'Read More' : '',
        ctaUrl: item.link || ''

      }));

      this.currentIndex = 0;

      console.log('Mapped Slider Images:', this.slides);

      this.cdr.detectChanges();

      // Start autoplay after receiving slider data
      if (this.slides.length > 1 && this.isAutoPlaying) {
        this.startAutoPlay();
      }

      // No images returned
      if (this.pendingBannerImages === 0) {
        this.finishBannerLoading();
      }

    },

    error: (err: any) => {

      console.error('Home API Error:', err);

      this.slides = [];

      this.finishBannerLoading();

    }

  });
}


getImageUrl(imageName: string): string {

  if (!imageName) return '';

  if (imageName.startsWith('http')) {
    return imageName;
  }

   const baseUrl = environment.baseUrl.replace(/\/$/, '');

  const imagePath = imageName.replace(/^\/+/, '');

  return `${baseUrl}/${imagePath}`;
}


  startAutoPlay(): void {

    if (this.autoPlayInterval || this.slides.length <= 1) return;

    this.ngZone.runOutsideAngular(() => {

      this.autoPlayInterval = setInterval(() => {

        if (!this.isHovered && this.isAutoPlaying) {

          this.ngZone.run(() => {
            this.nextSlide();
            this.cdr.markForCheck();
          });

        }

      }, this.AUTO_PLAY_DELAY);

    });
  }

  stopAutoPlay(): void {

    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }

  }

  nextSlide(): void {

    if (!this.slides.length) return;

    this.currentIndex =
      (this.currentIndex + 1) % this.slides.length;

  }

  prevSlide(): void {

    if (!this.slides.length) return;

    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;

  }

  goToSlide(index: number): void {

    this.currentIndex = index;

  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  toggleAutoPlay(): void {

    this.isAutoPlaying = !this.isAutoPlaying;

    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }

  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {

    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }

  }




  onBannerImageLoaded(): void {

  if (this.pendingBannerImages > 0) {
    this.pendingBannerImages--;
  }

  if (this.pendingBannerImages === 0) {
    this.finishBannerLoading();
  }

}

private finishBannerLoading(): void {

  if (this.bannerLoaderActive) {

    this.bannerLoaderActive = false;

    this.pendingBannerImages = 0;

    this.loaderService.hide();

  }

}
}