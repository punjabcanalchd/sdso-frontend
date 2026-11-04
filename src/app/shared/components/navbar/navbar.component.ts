import { Component, HostListener, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';

import { LanguageService } from '../../../core/services/language.service';



export interface NavItem {
    id?: number;
  parent_id?: number | null;
  label: string;
  route?: string;
  externalUrl?: string;
  children?: NavItem[];
  isOpen?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private rawMenus: any[] = [];
  private langSub?: Subscription;
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  isAuthenticated$ = this.auth.isAuthenticated$();

  constructor(
  public languageService: LanguageService
) {}
   private readonly baseUrl = environment.baseUrl;

  logout(): void {
    this.auth.logout();
    this.closeMenu();
  }
  navigateDashboard(): void {
    this.router.navigate([
      this.auth.getDashboardRoute()
    ]);
  }
  isMenuOpen = false;
  navItems: NavItem[] = [];
  ngOnInit() {
    this.fetchAndBuildNavbar();
    this.langSub = this.languageService.currentLang$.subscribe(() => {
      if (this.rawMenus.length > 0) {
        this.buildNavTree();
      }
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  private isItemActive(item: any): boolean {
    return !!item && (item.status === true || item.status == 1 || item.status === '1' || item.status === 'true');
  }

  private buildNavTree(): void {
    const isPb = this.languageService.getCurrentLang() === 'pb';

    const mapMenu = (m: any): NavItem => {
      let internalRoute: string | undefined = '/';
      let extUrl: string | undefined;

      if (m.page_id) {
        internalRoute = `/pages/${m.page_id}/1`;
      } else if (m.external_link) {
        const link = m.external_link.trim();

        if (link.toLowerCase().endsWith('.pdf')) {
          extUrl = link.startsWith('/') ? link : `/${link}`;
          internalRoute = undefined;
        } else if (/^https?:\/\//i.test(link)) {
          extUrl = link;
          internalRoute = undefined;
        } else {
          internalRoute = link.startsWith('/') ? link : `/${link}`;
        }
      }

      const label = isPb
        ? (m.punjabi_description?.message || m.name_pa || m.english_description?.message || m.name_en || 'Unnamed Menu')
        : (m.english_description?.message || m.name_en || m.punjabi_description?.message || m.name_pa || 'Unnamed Menu');

      const mapped: NavItem = {
        label,
        route: internalRoute,
        externalUrl: extUrl,
        isOpen: false,
      };

      if (m.children && m.children.length > 0) {
        mapped.children = m.children
          .filter((child: any) => this.isItemActive(child))
          .map((child: any) => mapMenu(child));
      }

      return mapped;
    };

    const activeMenus = this.rawMenus
      .filter((m: any) => this.isItemActive(m))
      .sort((a: any, b: any) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));

    this.navItems = activeMenus.map((m: any) => mapMenu(m));
    this.cdr.detectChanges();
  }

  fetchAndBuildNavbar() {
    this.api.get<any>('/front/menus').subscribe({
      next: (res) => {
        this.rawMenus = res.data || [];
        this.buildNavTree();
      },
      error: (err) => {
        console.error('Failed to load dynamic navbar', err);
        this.cdr.detectChanges();
      }
    });
  }

    toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.closeAllSubmenus();
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.closeAllSubmenus();
  }


  toggleSubmenu(item: NavItem, siblingGroup?: NavItem[]): void {
    const targetState = !item.isOpen;

    if (siblingGroup) {
      siblingGroup.forEach(sibling => sibling.isOpen = false);
    } else {
      this.closeAllSubmenus();
    }

    item.isOpen = targetState;
  }

  private closeAllSubmenus(iteams: NavItem[] = this.navItems): void {
    iteams.forEach(item => {
      item.isOpen = false;
      if (item.children && item.children.length > 0) {
        this.closeAllSubmenus(item.children);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.navbar')) {
      this.closeMenu();
    }
  }


getLocalizedRoute(route: string | undefined | null): string {

  if (!route) {
    return '/';
  }

  // Keep external URLs unchanged
  if (
    route.startsWith('http://') ||
    route.startsWith('https://') ||
    route.startsWith('mailto:')
  ) {
    return route;
  }

  const lang = this.languageService.getCurrentLang();

  const cleanRoute = route.replace(/^\/+/, '');

  if (lang === 'en') {
    return '/' + cleanRoute;
  }

  if (
    cleanRoute === lang ||
    cleanRoute.startsWith(lang + '/')
  ) {
    return '/' + cleanRoute;
  }

  return '/' + lang + '/' + cleanRoute;
}
 

  //   private getLanguagePrefix(): string {
  //     return window.location.pathname.startsWith('/pb') ? 'pb' : 'en';
  //   }

  // private getMenuUrl(route: string): string {
  //     const language = this.getLanguagePrefix();
  //     const cleanRoute = route.replace(/^\/+/, '');

  //     return `${this.baseUrl}/${language}/${cleanRoute}`;
  //   }
}