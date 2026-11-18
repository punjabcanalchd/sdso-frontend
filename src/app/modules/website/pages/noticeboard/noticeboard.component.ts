import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { BreadcrumbItem, BreadcrumbComponent }  from '../../../../shared/components/breadcrumb/breadcrumb';
import { ApiService } from '../../../../core/services/api.service';
import { LanguageService } from '../../../../core/services/language.service';

export interface NoticeItem {
  id: number;
  description: string;
  publishDate: string;
  fileUrl: string;
}

@Component({
  selector: 'app-noticeboard',
  standalone: true,
  imports: [DocumentListComponent, BreadcrumbComponent],
  templateUrl: './noticeboard.component.html'
})
export class NoticeboardMainComponent implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private languageService = inject(LanguageService);

  documents: NoticeItem[] = [];
  isLoading = false;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Notice Board' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'description', label: 'Description', widthClass: 'col-7' },
    { key: 'publishDate', label: 'Publish Date', widthClass: 'col-2' },
    { key: 'fileUrl', label: 'Download', type: 'download', widthClass: 'col-2' }
  ];

  ngOnInit(): void {
    this.loadNoticeboard();
  }

  loadNoticeboard(): void {

    this.isLoading = true;

    const language = this.languageService.getCurrentLang() || 'en';
    const isPb = language === 'pb';

    this.api.get<any>(`/front/home/${this.languageService.getCurrentLang()}`).subscribe({

      next: (res) => {

        this.isLoading = false;
          console.log("NOTICE==",res);

        if (res?.success && Array.isArray(res?.data?.noticeboardTabs)) {

          const notices = res.data.noticeboardTabs;

          this.documents = notices.map((item: any) => ({
            id: item.id,

            description: isPb
              ? (item.description_pb || item.description || item.title_pb || item.title)
              : (item.description || item.title),

            publishDate: item.date || item.raw_date,

            fileUrl: item.file_url || ''
          }));

        } else {
          this.documents = [];
        }

        console.log('Noticeboard Data:', this.documents);

        this.cdr.markForCheck();
      },

      error: (err) => {

        this.isLoading = false;

        console.error('Failed to load Noticeboard:', err);

        this.cdr.markForCheck();
      }
    });
  }
}