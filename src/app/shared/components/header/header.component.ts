import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

import { AuthService } from '../../../core/auth/auth.service';
import { APP_ASSETS } from '../../../core/constants/app-assets';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CommonModule, NavbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  APP_ASSETS = APP_ASSETS;

  private auth = inject(AuthService);
  private router = inject(Router);
  private siteSettings = inject(SiteSettingsService);

  isAuthenticated$ = this.auth.isAuthenticated$();
  siteLogo$ = this.siteSettings.logoUrl$;
  settings$ = this.siteSettings.settings$;

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== this.APP_ASSETS.LOGO) {
      img.src = this.APP_ASSETS.LOGO;
    }
  }

  navigateDashboard(): void {
    this.router.navigate([
      this.auth.getDashboardRoute()
    ]);
  }

  logout(): void {
    this.auth.logout();
  }
}