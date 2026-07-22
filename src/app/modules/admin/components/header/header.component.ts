import { Component, inject, Output, Input, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

export interface HeaderAction {
  label: string;
  icon?: string;
  action: string;
  class?: string;
}

export interface HeaderConfig {
  showMenuButton?: boolean;
  showPortalLink?: boolean;
  portalLink?: string;
  portalLabel?: string;
  showDateTime?: boolean;
  showUserMenu?: boolean;
  userMenuItems?: HeaderAction[];
}

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMobile = window.innerWidth > 992;
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth > 992;
  }

  @Input() config: HeaderConfig = {
    showMenuButton: true,
    showPortalLink: true,
    portalLink: '/',
    portalLabel: 'Back to Web Portal',
    showDateTime: true,
    showUserMenu: true
  };
  @Output() menuClick = new EventEmitter<void>();
  @Output() menuAction = new EventEmitter<string>();

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  user$ = this.authService.user$;
  currentDateTime = new Date();
  private intervalId: any;

  

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentDateTime = new Date();
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onMenuClick() {
    this.menuClick.emit();
  }

  onMenuAction(action: string): void {
    this.menuAction.emit(action);
  }
}