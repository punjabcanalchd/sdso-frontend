import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FrontendPagesService } from '../../../modules/website/pages/frontend-pages/frontend-pages.service';
import { environment } from '../../../../environments/environment';


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
  }

  // Get slider data from Laravel API
loadHomeSliders(): void {
  this.frontendPagesService.getHomeSliders().subscribe({
    next: (response: any) => {
      console.log('Complete Slider Response:', response);
      // Extract images from results array
      const images = response.data?.results || [];
      // Get selected language
      const currentLanguage = localStorage.getItem('user_lang') || 'en';

      this.slides = images.map((item: any, index: number) => ({
        id: item.id,
        imageUrl: this.getImageUrl(item.image_name),

         altText: currentLanguage === 'pb'
          ? (item.title_pb || 'SDSO Banner')
          : (item.title_en || 'SDSO Banner'),

         title: currentLanguage === 'pb'
          ? (item.title_pb || '')
          : (item.title_en || ''),

        // subtitle: currentLanguage === 'pb'
        //   ? (item.description_pb || '')
        //   : (item.description_en || ''),

        // subtitle: item.description || '',

        ctaLabel: item.link ? 'Read More' : '',
        ctaUrl: item.link || ''
      }));

      this.currentIndex = 0;

      if (this.slides.length > 1 && this.isAutoPlaying) {
        this.startAutoPlay();
      }

      console.log('Mapped Slider Images:', this.slides);

      this.cdr.detectChanges();

    },

    error: (error: any) => {
      console.error('Slider API Error:', error);
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

}