
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { FrontendPagesService } from './../../pages/frontend-pages/frontend-pages.service';
import { LanguageService } from '../../../../core/services/language.service';
import { SharedModule } from '../../../../shared/shared-module';



@Component({
  selector: 'app-noticeboard-detail',
  standalone: true,
  imports: [CommonModule,SharedModule],
 
  templateUrl: './noticeboard-detail.component.html',
  styleUrl: './noticeboard-detail.component.scss'
})
export class NoticeboardDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private pageService = inject(FrontendPagesService);
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);

  categoryData: any = null;

  notificationArray: { [key: number]: any[] } = {};

  noticeboardData: any = null;

  cid: number = 0;

  moduleMetaTitle = '';

  loading = false;

  errorMessage = '';

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      const lang = this.languageService.getCurrentLang();

      const languageId = this.languageService.getLanguageId(lang);

      console.log('Noticeboard ID:', id);
      console.log('Language ID:', languageId);

      if (id > 0) {
        this.loadNoticeboard(id, languageId);
      } else {
        this.loading = false;
        this.errorMessage = 'Invalid noticeboard ID.';
      }

    });

  }

  loadNoticeboard(id: number, languageId: number): void {

    this.loading = true;
    this.errorMessage = '';

    this.pageService.getNoticeboard(id, languageId).subscribe({

      next: (response: any) => {

        console.log('Complete API Response:', response);

        if (response?.status && response?.data) {

          const data = response.data;

          this.categoryData = data.category_data || null;

          this.notificationArray = data.notificationarray || {};

          // Defensively parse any stringified JSON description/title
          if (this.notificationArray) {
            for (const keyStr of Object.keys(this.notificationArray)) {
              const catKey = Number(keyStr);
              this.notificationArray[catKey] = (this.notificationArray[catKey] || []).map((item: any) => {
                let title = item.title || '';
                let description = item.description || '';
                let msg = item.message || '';

                if (typeof msg === 'string' && msg.trim().startsWith('{')) {
                  try {
                    const parsed = JSON.parse(msg);
                    if (parsed && typeof parsed === 'object') {
                      title = parsed.title || title;
                      description = parsed.description || description;
                    }
                  } catch (e) {}
                }

                if (typeof title === 'string' && title.trim().startsWith('{')) {
                  try {
                    const parsed = JSON.parse(title);
                    if (parsed && typeof parsed === 'object') {
                      title = parsed.title || '';
                      description = description || parsed.description || '';
                    }
                  } catch (e) {}
                }

                return {
                  ...item,
                  title: title || item.name || '',
                  description: description || (!title ? msg : ''),
                  message: description || title || msg,
                };
              });
            }
          }

          this.noticeboardData = data.noticeboard_data || null;

          this.cid = Number(data.cid) || 0;

          this.moduleMetaTitle = data.module_meta_title || '';

          // console.log('Category Data:', this.categoryData);
          // console.log('Notification Array:', this.notificationArray);
          // console.log('Noticeboard Data:', this.noticeboardData);

        } else {

          this.errorMessage = response?.message || 'Noticeboard not found.';

        }

        this.loading = false;

        // Refresh Angular view
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Noticeboard API Error:', error);

        this.errorMessage = 'Unable to load noticeboard details.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

  getCategoryName(): string {

    const languageId = this.languageService.getCurrentLanguageId();

    const description = this.categoryData?.descriptions?.find(
      (item: any) => Number(item.language_id) === Number(languageId)
    );

    return description?.message || this.categoryData?.name || '';

  }

}
