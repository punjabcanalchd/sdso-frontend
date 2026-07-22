import { Component, OnInit, OnDestroy,ChangeDetectorRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {

  toasts: any[] = [];
  private pendingToasts: any[] = [];
   private isShowing = false;

  private subscription!: Subscription;
  private timers = new Map<number, any>();


constructor(
  private toastService: ToastService,
  private cdr: ChangeDetectorRef
) {}

 ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      if (!toast?.message) return;
             this.pendingToasts.push(toast);
      
      this.showNextToast();
    });
  }
  showNextToast() {
    if (this.isShowing || this.pendingToasts.length === 0) return;
    this.isShowing = true;
    
    const nextToast = this.pendingToasts.shift();
    this.toasts = [nextToast];
    this.cdr.detectChanges();
     const timeOnScreen = this.pendingToasts.length > 0 ? 1200 : (nextToast.duration || 2500);
    setTimeout(() => {
      this.closeToast(nextToast.id);
    }, timeOnScreen);
  }
  closeToast(id: number) {
    this.toasts = [];
    this.isShowing = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showNextToast();
    }, 150); 
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  getBootstrapClass(type: string): string {
  switch (type) {
     case 'success':
        return 'bg-success-subtle text-success-emphasis border border-success-subtle';
      case 'error':
        return 'bg-danger-subtle text-danger-emphasis border border-danger-subtle';
      case 'warning':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'info':
        return 'bg-info-subtle text-info-emphasis border border-info-subtle';
      default:
        return 'bg-light text-dark';
    }
  }
getIconClass(type: string): string {
  switch (type) {
    case 'success':
      return 'bi-check-circle-fill text-success';

    case 'error':
      return 'bi-x-circle-fill text-danger';

    case 'warning':
      return 'bi-exclamation-triangle-fill text-warning';

    case 'info':
      return 'bi-info-circle-fill text-info';

    default:
      return 'bi-bell-fill';
    }
  }
}
