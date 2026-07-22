import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { APP_ASSETS } from '../../../core/constants/app-assets';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  APP_ASSETS = APP_ASSETS;

  private auth = inject(AuthService);
  private router = inject(Router);

  isAuthenticated$ = this.auth.isAuthenticated$();

  navigateDashboard(): void {
    this.router.navigate([
      this.auth.getDashboardRoute()
    ]);
  }

  logout(): void {
    this.auth.logout();
  }
}