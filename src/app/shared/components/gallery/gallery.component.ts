import { Component, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {trigger, transition, style, animate} from '@angular/animations';
export interface GalleryImage {
  url: string;
  alt: string;
}


export interface GalleryEvent {
  id: number;
  coverUrl: string; // The image shown on the card
  title: string;
  date: string;
  images: GalleryImage[]; //  images shown in the slider
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  animations: [
    trigger('slideAnimation', [
      
      transition(':enter', [
        style({ transform: 'translateX({{enterOffset}})' }), 
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)' }))
      ]),
      
      transition(':leave', [
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX({{leaveOffset}})' })) //  fade out
      ])
    ])
  ]
})
export class GalleryComponent implements OnDestroy {
  
  
  events: GalleryEvent[] = [
    {
      id: 1,
      // The Cover Image for the Card
      coverUrl: '/mediaGallery/myattachments1.jpg',
      title: 'WORLD WATER DAY 2026',
      date: '03/27/2026',
      
      // The Different Images for the Slideshow
      images: [
        {
        
          url: '/mediaGallery/myattachments.jpg',
          alt: 'Water treatment facility'
        },
        {
         
          url: '/mediaGallery/myattachments1.jpg',
          alt: 'Team meeting'
        },
        {
         
          url: '/mediaGallery/myattachments2.jpg',
          alt: 'Forest river'
        }
        ,
        {
         
          url: '/mediaGallery/myattachments3.jpg',
          alt: 'Forest river'
        },
        {
         
          url: '/mediaGallery/myattachments4.jpg',
          alt: 'Forest river'
        },
        {
         
          url: '/mediaGallery/myattachments5.jpg',
          alt: 'Forest river'
        },
        {
         
          url: '/mediaGallery/myattachments6.jpg',
          alt: 'Forest river'
        },
        {
         
          url: '/mediaGallery/myattachments7.jpg',
          alt: 'Forest river'
        }
      ]
    }
  ];

  
  selectedEvent: GalleryEvent | null = null;
  activeIndex: number = 0;
  direction: 'next' | 'prev' = 'next';

private autoplayInterval: any; 

constructor(private cdr: ChangeDetectorRef) {}

ngOnDestroy(): void { 
  this.stopAutoplay(); 
}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
  
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
    this.direction= 'next';
    document.body.style.overflow = 'hidden'; 
  document.documentElement.style.overflow = 'hidden';

    this.startAutoplay();
  }

  closeLightbox(): void {
    this.selectedEvent = null;
    document.body.style.overflow = ''; 
    document.documentElement.style.overflow = '';
    this.stopAutoplay();
  }

startAutoplay(): void {
    this.stopAutoplay(); 
    this.autoplayInterval = window.setInterval(() => {
      this.nextImage(undefined, false); 
    }, 3000);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      window.clearInterval(this.autoplayInterval);
    }
  }

  // Next/Prev Logic for the Carousel
  nextImage(e?: Event, resetTimer: boolean = true): void {
    if(e) e.stopPropagation(); // Stops the background from closing when clicking the arrow
    if (this.selectedEvent) {
      this.direction= 'next';
      this.activeIndex = (this.activeIndex + 1) % this.selectedEvent.images.length;
   this.cdr.detectChanges(); 
    }
    if (resetTimer) this.startAutoplay();
  }

  prevImage(e?: Event): void {
   if(e) e.stopPropagation();
    if (this.selectedEvent) {
      this.direction='prev';
      this.activeIndex = (this.activeIndex - 1 + this.selectedEvent.images.length) % this.selectedEvent.images.length;
   this.cdr.detectChanges();
    }
    this.startAutoplay();
  }
}