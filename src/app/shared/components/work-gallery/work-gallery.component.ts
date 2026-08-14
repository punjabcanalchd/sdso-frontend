import { Component, OnInit, OnDestroy, HostListener, NgZone, ChangeDetectorRef } from '@angular/core';
import {trigger, transition, style, animate} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
export interface GalleryItem {
  id: number;
  imageUrl: string;
  altText: string;
  title: string;
  caption: string;
  category: string;
}

@Component({
  selector: 'app-work-gallery',
  standalone: true,
   imports: [CommonModule, RouterLink],
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

  // Active filter tab
  activeFilter = 'All';

  // Lightbox state
  lightboxOpen = false;
  lightboxIndex = 0;

  // Slider state
  currentSlide = 0;
  readonly itemsPerSlide = 3;

  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;

  categories = ['All', 'Field Work', 'Infrastructure', 'Community', 'Technology'];

  items: GalleryItem[] = [
    { id: 1,  imageUrl: 'assets/images/front/gallery/g1.png',  altText: 'Groundwater survey team conducting field inspection',         title: 'Field Survey',          caption: 'Groundwater survey team conducting field inspection in rural areas.',    category: 'Field Work'     },
    { id: 2,  imageUrl: 'assets/images/front/gallery/g2.png',  altText: 'Water treatment plant infrastructure overview',               title: 'Treatment Plant',       caption: 'State-of-the-art water treatment facility serving 50,000 residents.',   category: 'Infrastructure' },
    { id: 3,  imageUrl: 'assets/images/front/gallery/g3.png',  altText: 'Community awareness programme on water conservation',         title: 'Awareness Drive',       caption: 'Community outreach programme promoting responsible water usage.',        category: 'Community'      },
    { id: 4,  imageUrl: 'assets/images/front/gallery/g4.png',  altText: 'Digital monitoring dashboard for water resource management',  title: 'Digital Monitoring',    caption: 'Real-time digital dashboard tracking groundwater levels statewide.',    category: 'Technology'     },
    { id: 5,  imageUrl: 'assets/images/front/gallery/g5.png',  altText: 'Borewell drilling rig in operation at a project site',        title: 'Drilling Operations',   caption: 'Authorised drilling rig operating under permit at a designated site.',  category: 'Field Work'     },
    // { id: 6,  imageUrl: 'assets/images/front/gallery/g6.jpg',  altText: 'Canal irrigation infrastructure maintenance work',            title: 'Canal Maintenance',     caption: 'Annual maintenance of irrigation canal network across the district.',   category: 'Infrastructure' },
    // { id: 7,  imageUrl: 'assets/images/front/gallery/g7.jpg',  altText: 'Water conservation workshop for farmers',                     title: 'Farmer Workshop',       caption: 'Training session on drip irrigation and water-efficient farming.',       category: 'Community'      },
    // { id: 8,  imageUrl: 'assets/images/front/gallery/g8.jpg',  altText: 'GIS mapping of water resources using satellite data',         title: 'GIS Mapping',           caption: 'Satellite-based GIS mapping of groundwater recharge zones.',            category: 'Technology'     },
    // { id: 9,  imageUrl: 'assets/images/front/gallery/g9.jpg',  altText: 'Water quality testing laboratory analysis',                   title: 'Quality Testing',       caption: 'Laboratory analysis ensuring water quality meets safety standards.',    category: 'Field Work'     },
  ];

  get filteredItems(): GalleryItem[] {
    return this.activeFilter === 'All'
      ? this.items
      : this.items.filter(i => i.category === this.activeFilter);
  }

  get totalSlides(): number {
    return Math.ceil(this.filteredItems.length / this.itemsPerSlide);
  }

  get visibleItems(): GalleryItem[] {
    const start = this.currentSlide * this.itemsPerSlide;
    return this.filteredItems.slice(start, start + this.itemsPerSlide);
  }

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  setFilter(cat: string): void {
    this.activeFilter = cat;
    this.currentSlide = 0;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  startAutoSlide(): void {
    if (this.autoSlideInterval) return;
    this.ngZone.runOutsideAngular(() => {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
        this.cdr.markForCheck();
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
  openLightbox(globalIndex: number): void {
    this.lightboxIndex = this.currentSlide * this.itemsPerSlide + globalIndex;
    this.lightboxOpen = true;
    this.stopAutoSlide();
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
    this.startAutoSlide();
  }

  lightboxPrev(): void {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
  }

  lightboxNext(): void {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.filteredItems.length;
  }

  get lightboxItem(): GalleryItem {
    return this.filteredItems[this.lightboxIndex];
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
