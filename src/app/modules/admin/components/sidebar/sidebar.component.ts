import { Component, inject, OnInit, SimpleChanges, SimpleChange, HostListener, ChangeDetectorRef } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { APP_ASSETS } from '../../../../core/constants/app-assets';
import { Router, NavigationEnd, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';

interface MenuItem {
  title: string;
  routerLink?: string;
  icon?: string;
  children?: { title: string; routerLink: string }[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Input() mobile = window.innerWidth < 992;
  menuItems: MenuItem[] = [];

  APP_ASSETS = APP_ASSETS;
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private apiService = inject(ApiService);

  @HostListener('window:resize')
  onResize() {
    this.mobile = window.innerWidth < 992;
  }
  

  directToHome(): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.apiService.get<any[]>('/admin/menus/sidebar').subscribe({
      next: (response: any) => {
          const dynamicItems = 
        this.menuItems = this.mapBackendMenuToFrontend(response.data || response);
        this.menuItems = [
          { title: 'Dashboard', icon: 'bi bi-speedometer2', routerLink: '/admin/dashboard', isExpanded: false },
          {
            title: 'Groundwater Extraction',
            routerLink: '',
            icon: 'bi bi-card-list',
            isExpanded: false,
            children: [      
              { title: 'Application List', routerLink: '/admin/groundwaterExtraction/application-list' }      
            ]
          },
          ...dynamicItems
        ];
        this.checkActiveRoute();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load dynamic sidebar:', err)
    });
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkActiveRoute();
    });
  }

  private mapBackendMenuToFrontend(menus: any[]): MenuItem[] {
    if (!menus) return [];

    return menus.map(menu => {
      let rawIcon = menu.icon || 'circle';
      let formattedIcon = `bi bi-${rawIcon}`

      const item: MenuItem = {
        title: menu.title || menu.name,
        icon: formattedIcon,
        isExpanded: false
      };

      if (menu.link && menu.link !== '#') {
        let safeLink = menu.link.startsWith('/') ? menu.link : `/${menu.link}`;
        if (!safeLink.startsWith('/admin')) {
          safeLink = `/admin${safeLink}`;
        }
        item.routerLink = safeLink;
      }

      if (menu.children && menu.children.length > 0) {
        item.children = this.mapBackendMenuToFrontend(menu.children) as any;
      }
      return item;
    });
  }

  private checkActiveRoute(): void {
    if (!this.menuItems || this.menuItems.length === 0) return;

    const currentUrl = this.router.url;

    this.menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => child.routerLink && currentUrl.startsWith(child.routerLink));
        if (hasActiveChild) {
          item.isExpanded = true;
        }
      }
    });
    this.cdr.detectChanges();
  }
}