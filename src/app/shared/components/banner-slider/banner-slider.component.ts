import { Component, OnInit, OnDestroy, HostListener, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

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
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_PLAY_DELAY = 5000;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  slides: BannerSlide[] = [
    {
      id: 1,
      imageUrl: 'assets/images/banner1.png',
      altText: 'Digital India Initiative - Empowering citizens through technology',
      title: 'Digital India Initiative',
      subtitle: 'Empowering citizens through technology and innovation',
      ctaLabel: 'Learn More',
      ctaUrl: '/services'
    },
    {
      id: 2,
      imageUrl: 'assets/images/login-illustration (2).png',
      altText: 'water Management - Sustainable water resources for future generations',
      title: 'water Management',
      subtitle: 'Sustainable water resources for future generations',
      ctaLabel: 'Apply Online',
      ctaUrl: '/services'
    },
    {
      id: 3,
      imageUrl: 'assets/images/banner3.png',
      altText: 'Transparent Governance - RTI and public information access',
      title: 'Transparent Governance',
      subtitle: 'Access public information under the Right to Information Act',
      ctaLabel: 'File RTI',
      ctaUrl: '/rti'
    },
    {
      id: 4,
      imageUrl: 'assets/images/banner4.jpg',
      altText: 'Citizen Services - Fast-track approvals and online applications',
      title: 'Citizen Services',
      subtitle: 'Fast-track approvals and seamless online applications',
      ctaLabel: 'Get Started',
      ctaUrl: '/services'
    }
  ];

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    if (this.autoPlayInterval) return;
    // Run outside Angular zone to avoid spurious CD cycles.
    // Use markForCheck() to notify Angular of the state change
    // without re-entering the zone (prevents NG0100).
    this.ngZone.runOutsideAngular(() => {
      this.autoPlayInterval = setInterval(() => {
        if (!this.isHovered) {
          this.nextSlide();
          this.cdr.markForCheck();
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
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
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

  // Keyboard navigation for slider
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }
}
