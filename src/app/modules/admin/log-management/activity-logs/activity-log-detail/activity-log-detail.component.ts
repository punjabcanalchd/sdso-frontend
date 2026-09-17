import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-activity-log-detail',
  imports: [CommonModule],
  templateUrl: './activity-log-detail.component.html',
  styleUrl: './activity-log-detail.component.scss',
})
export class ActivityLogDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  activityLog: any = null;
  loading = false;

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/admin/logs']);
      return;
    }

    this.loadActivityLog(id);
  }

  loadActivityLog(id: string): void {

    this.loading = true;
    this.cdr.detectChanges();

    this.userService.getActivityLog(id).subscribe({

      next: (response) => {

        console.log('Response:', response);

        this.activityLog = response.data;
        this.loading = false;

        console.log('Loading:', this.loading);
        console.log('Activity Log:', this.activityLog);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);

        this.loading = false;

        this.cdr.detectChanges();

        this.router.navigate(['/admin/logs']);
      }

    });
  }

  goBack(): void {
    this.router.navigate(['/admin/logs']);
  }
}