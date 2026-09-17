import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-exception-log-detail',
  imports: [CommonModule],
  templateUrl: './exception-log-detail.component.html',
  styleUrl: './exception-log-detail.component.scss',
})
export class ExceptionLogDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  exceptionLog: any = null;
  loading = false;

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/admin/exception-log']);
      return;
    }

    this.loadExceptionLog(id);
  }

  loadExceptionLog(id: string): void {

    this.loading = true;
    this.cdr.detectChanges();

    this.userService.getExceptionLog(id).subscribe({

      next: (response) => {

        this.exceptionLog = {
          ...response.data,
          body: this.parseJson(response.data.body),
          trace: this.parseJson(response.data.trace)
        };
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);

        this.loading = false;

        this.cdr.detectChanges();

        this.router.navigate(['/admin/exception-log']);
      }

    });
  }

  goBack(): void {
      this.router.navigate(['/admin/exception-log']);
  }

  parseJson(value: any): any {
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}