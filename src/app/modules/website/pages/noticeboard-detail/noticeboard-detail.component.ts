import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FrontendPagesService } from './../../pages/frontend-pages/frontend-pages.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-noticeboard-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticeboard-detail.component.html',
  styleUrl: './noticeboard-detail.component.scss'
})
export class NoticeboardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pageService = inject(FrontendPagesService);
  private languageService = inject(LanguageService);

  categoryData: any = null;
  notificationArray: { [key: number]: any[] } = {};
  noticeboardData: any = null;
  cid: string | number = '';
  moduleMetaTitle: string = '';

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const lang = this.languageService.getCurrentLang();
      const languageId = this.languageService.getLanguageId(lang);

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
          this.categoryData = response.data.category_data;
          this.notificationArray = response.data.notificationarray || {};
          this.noticeboardData = response.data.noticeboard_data;
          this.cid = response.data.cid;
          this.moduleMetaTitle = response.data.module_meta_title;
        } else {
          this.errorMessage = response.message || 'Noticeboard not found.';
        }

        // 👉 CRITICAL: Set loading to false so the UI renders the table!
        this.loading = false;
      },
      error: (error) => {
        console.error('Noticeboard API error:', error);
        this.errorMessage = 'Unable to load noticeboard details.';
        this.loading = false; // Also set to false on error
      }
    });
  }


  // loadNoticeboard(id: number, languageId: number): void {
  //   this.loading = true;
  //   this.errorMessage = '';

  //   // Calling the service method that hits your noticeboard listing endpoint
  //   this.pageService.getNoticeboard(id, languageId).subscribe({
  //     next: (response: any) => {
  //       console.log('Noticeboard API response:', response);

  //       if (response.status && response.data) {
  //         this.categoryData = response.data.category_data;
  //         this.notificationArray = response.data.notificationarray || {};
  //         this.noticeboardData = response.data.noticeboard_data;
  //         this.cid = response.data.cid;
  //         this.moduleMetaTitle = response.data.module_meta_title;
  //       } else {
  //         this.errorMessage = response.message || 'Noticeboard not found.';
  //       }

  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.error('Noticeboard API error:', error);
  //       this.errorMessage = 'Unable to load noticeboard details.';
  //       this.loading = false;
  //     }
  //   });
  // }

  // Helper to extract the description message based on active language or fallback
getCategoryName(): string {

  const languageId = this.languageService.getCurrentLanguageId();

  const description = this.categoryData?.descriptions?.find(
    (item: any) => item.language_id === languageId
  );

  return description?.message || this.categoryData?.name || '';
}
}