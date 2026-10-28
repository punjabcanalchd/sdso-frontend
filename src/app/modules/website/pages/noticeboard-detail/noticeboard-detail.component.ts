import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { FrontendPagesService } from './../../pages/frontend-pages/frontend-pages.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-noticeboard-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticeboard-detail.component.html',
  styleUrl: './noticeboard-detail.component.scss'
})
export class NoticeboardDetailComponent implements OnInit {

  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private pageService = inject(FrontendPagesService);

  noticeboard: any;
  loading = false;
  errorMessage = '';

 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    const lang = params.get('lang') || 'en';

    const languageIds: Record<string, number> = {
      en: 1,
      pb: 2,      
    };

    const languageId = languageIds[lang] ?? 1;

    if (id > 0) {
      this.loadNoticeboard(id, languageId);
    } else {
      this.errorMessage = 'Invalid noticeboard ID.';
    }
  });
}

    loadNoticeboard(id: number, languageId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.pageService.getNoticeboard(id, languageId).subscribe({
      next: (response: any) => {
        console.log('Noticeboard API response:', response);

        if (response.status && response.data) {
          this.noticeboard = response.data;
        } else {
          this.errorMessage = response.message || 'Noticeboard not found.';
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Noticeboard API error:', error);
        this.errorMessage = 'Unable to load noticeboard details.';
        this.loading = false;
      }
    });
  }

  get description(): string {
    const descriptions = this.noticeboard?.descriptions ?? [];
    return descriptions[0]?.message ?? '';
  }
}
