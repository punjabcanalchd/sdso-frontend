  import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, NgZone, ChangeDetectorRef
  } from '@angular/core';

  import { RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';


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

    export interface FooterStats {
    totalVisitors: number | null;
    lastUpdated: string | null;
    }


    @Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule,RouterLink],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    })
  
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('logoTrack') logoTrack!: ElementRef<HTMLDivElement>;

    currentYear = new Date().getFullYear();

    // ── Stats ────────────────────────────────────────────────────────────────
    stats: FooterStats = { totalVisitors: null, lastUpdated: null };
    statsLoading = true;
    statsError   = false;


    logoGroups: PartnerLogo[][] = [];

    private groupLogos(): void {
      for (let i = 0; i < this.partnerLogos.length; i += 3) {
        this.logoGroups.push(this.partnerLogos.slice(i, i + 3));
      }
    }
    isPaused = false;

    private autoScrollId: number | null = null;
    /** px per animation frame (~60 fps → ~1.5 px/frame = ~90 px/s) */
    private readonly SCROLL_SPEED = 1.2;
    /** px to jump per arrow click */
    private readonly ARROW_STEP   = 220;

    // Footer Image Path
    dataGovLogo = 'assets/images/front/footer/data-gov-logo.png';
    digitalIndiaLogo = 'assets/images/front/footer/digital-india-logo.png';
    imgappStore = 'assets/images/front/footer/img_app_store.png';  
    imgGooglePlay = 'assets/images/front/footer/img_google_play.png';
    meityLogo = 'assets/images/front/footer/Meity_logo.png';
    myGovFooterLogo = 'assets/images/front/footer/mygov-footer-logo.png';
    pmIndiaLogo = 'assets/images/front/footer/pm-india-logo.png';
    qrCodeLogo  = 'assets/images/front/footer/qr_code_logo.png';
    indiaGovLogo  = 'assets/images/front/footer/india-gov-logo.png';


    policyLinks = [
    { path: '/website-policies', label: 'Website Policies' },
    { path: '/mobile-app-policy', label: 'Mobile App Policy' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/web-information-manager', label: 'Web Information Manager' }
    ];
    importantLinks = [
    // { path: '/about/chairperson', label: 'About' },
    { path: '/about/pwrda', label: 'Home' },
    { path: '/about/chairperson', label: 'About' },
    { path: '', label: 'Raise a query' },
    { path: '', label: 'Privacy Policy' },  
    ];

    noticeBoardLinks = [
    { path: '', label: 'Press Notes' },
    { path: '', label: 'Notice Board' },
    { path: '', label: 'User Manual' },


    ];

    galleryLinks = [
        { path: '', label: 'Gallery' }

        ];

        partnerLogos: PartnerLogo[] = [
      {
        name: 'Data Gov',
        imageUrl: this.dataGovLogo,
        linkUrl: '#'
      },
      {
        name: 'Digital India',
        imageUrl: this.digitalIndiaLogo,
        linkUrl: '#'
      },
      {
        name: 'MeitY',
        imageUrl: this.meityLogo,
        linkUrl: '#'
      },
      {
        name: 'MyGov',
        imageUrl: this.myGovFooterLogo,
        linkUrl: '#'
      },
      {
        name: 'PM India',
        imageUrl: this.pmIndiaLogo,
        linkUrl: '#'
      },
      {
        name: 'India.gov.in',
        imageUrl: this.indiaGovLogo,
        linkUrl: '#'
      }
    ];

  get scrollLogos(): PartnerLogo[] {
    return [...this.partnerLogos, ...this.partnerLogos, ...this.partnerLogos];
  }

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadStats();
    this.groupLogos();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  ngAfterViewInit(): void {
  this.ngZone.runOutsideAngular(() => this.startAutoScroll());
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

    el.scrollBy({
      left: this.ARROW_STEP,
      behavior: 'smooth'
    });

    setTimeout(() => {
      if (!this.isPaused) {
        this.ngZone.runOutsideAngular(() => this.startAutoScroll());
      }
    }, 450);
  }

  // ── Arrow clicks ──────────────────────────────────────────────────────────
  scrollLeft(): void {
    const el = this.logoTrack?.nativeElement;
    if (!el) return;
    this.stopAutoScroll();
    el.scrollBy({ left: -this.ARROW_STEP, behavior: 'smooth' });
    // Resume auto-scroll after the smooth scroll settles (~400 ms)
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

      // Seamless loop: when we reach the end of the 2nd copy, jump back to the 1st copy
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

    // ── Footer links ──────────────────────────────────────────────────────────
    usefulLinks: FooterLink[] = [
    { label: 'Home',     url: '/' },
    { label: 'About Us', url: '/about' },
    { label: 'Services', url: '/services' },
    ];

    // policyLinks: FooterLink[] = [
    //   { label: 'Privacy Policy', url: '/privacy-policy' },
    //   { label: 'Terms of Use',   url: '/terms' },
    //   { label: 'Disclaimer',     url: '/disclaimer' },
    // ];

    private loadStats(): void {
    this.statsLoading = true;
    this.statsError   = false;
    // Use Promise.resolve() so the state update runs as a microtask
    // after the current CD pass completes — prevents NG0100.
    Promise.resolve().then(() => {
      this.statsLoading = false;
      this.statsError   = true;
      // this.cdr.markForCheck();
    });
    }



    
    }