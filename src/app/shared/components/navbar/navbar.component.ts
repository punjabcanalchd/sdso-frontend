import { Component, HostListener, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/auth/auth.service';

export interface NavItem {
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
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  isAuthenticated$ = this.auth.isAuthenticated$();

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
  }
    fetchAndBuildNavbar() {
    this.api.get<any>('/admin/menus').subscribe({
      next: (res) => {
        const rawMenus = res.data || [];
        const activeMenus = rawMenus
          .filter((m: any) => (m.status == 1 || m.status === true))
          .sort((a: any, b: any) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));

        const mappedItems: NavItem[] = activeMenus.map((m: any) => {
          let internalRoute: string | undefined = '/';
          let extUrl: string | undefined = undefined;

          if (m.page_id) {
             internalRoute = `/pages/${m.page_id}`;
          } else if (m.external_link) {
             if (m.external_link.startsWith('http')) {
                 extUrl = m.external_link;
                 internalRoute = undefined;
             } else {
                 internalRoute = m.external_link.startsWith('/') ? m.external_link : `/${m.external_link}`;
             }
          }

          return {
            id: m.menu_id,             
            parent_id: m.parent_id, 
            label: m.name_en,          
            route: internalRoute,
            externalUrl: extUrl,
            isOpen: false,
            children: []
          } as any;
        });

        const map = new Map();
        mappedItems.forEach((item: any) => map.set(item.id, item));
        const tree: NavItem[] = [];
        mappedItems.forEach((item: any) => {
          if (item.parent_id) {
            const parent = map.get(Number(item.parent_id));
            if (parent) {
              parent.children!.push(item);
            }
          } else {
            tree.push(item);
          }
        });

        const cleanEmptyChildren = (items: NavItem[]) => {
          items.forEach(item => {
            if (item.children && item.children.length === 0) {
              delete item.children;
            } else if (item.children) {
              cleanEmptyChildren(item.children);
            }
          });
        };
        cleanEmptyChildren(tree);

        this.navItems = tree;
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Failed to load dynamic navbar, using fallback', err);
        
        // --- TEMPORARY FALLBACK MENU ---
        // this.navItems = [
        //   { label: 'Home', route: '/', isOpen: false },
        //   { label: 'Services', route: undefined, isOpen: false, children: [
        //       { label: 'Apply for NOC', route: '/fee-calculator/industrial', isOpen: false },
        //       { label: 'Track Application', route: '/cons', isOpen: false }
        //   ]},
        //   { label: 'About Us', route: '/about', isOpen: false },
        //   { label: 'Contact Us', route: '/contact', isOpen: false }
        // ];
        
        
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
}