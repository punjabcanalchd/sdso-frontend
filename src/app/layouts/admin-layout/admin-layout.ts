import { Component, HostListener, inject} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent, HeaderConfig } from '../../modules/admin/components/header/header.component';
import { SidebarComponent } from '../../modules/admin/components/sidebar/sidebar.component';
import { AuthService } from '../../core/auth/auth.service';


declare const bootstrap: any;


@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  host: {
    'class': 'd-block h-100'
  }
})
export class AdminLayout{
  
  isMobile = window.innerWidth < 992;
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 992;
  }
  currentYear = new Date().getFullYear();
 
  
  private authService = inject(AuthService);
  private router = inject(Router);
 
  
  isSidebarCollapsed = false;
  toggleSidebar() {

    if (window.innerWidth < 992) {

      const element =
        document.getElementById('sidebar');

      const offcanvas =
        bootstrap.Offcanvas.getOrCreateInstance(element);

      offcanvas.toggle();

      return;
    }

    this.isSidebarCollapsed =
      !this.isSidebarCollapsed;
  }

  headerConfig: HeaderConfig = {
    showPortalLink: true,
    portalLabel: 'Back to Website',
    portalLink: '/',

    showDateTime: true,

    userMenuItems: [
      {
        label: 'Edit Profile',
        icon: 'bi bi-pencil-square',
        action: 'editProfile'
      },
      {
        label: 'Logout',
        icon: 'bi bi-box-arrow-right',
        action: 'logout'
      }
    ]
  };
  changePassword(): void {
    this.router.navigate(['/auth/password-change']);
  }

  editProfile(): void {
    this.router.navigate(['/auth/user-profile'])
  }

  logout(): void {
    this.authService.logout();
  }
  handleHeaderAction(action: string) {
    switch (action) {
      case 'changePassword':
        return this.changePassword();

      case 'editProfile':
        return this.editProfile();

      case 'logout':
        return this.logout();
    }
  }
}
