import { Component, OnInit, inject } from '@angular/core';
import { NoticeService } from '../../../../shared/services/notice.services';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { BreadcrumbItem, BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb';

export interface UserManualItem {
  id: number;
  description: string;
  publishDate: string;
  fileUrl: string;
}

@Component({
  selector: 'app-user-manual',
  standalone: true,
  imports: [DocumentListComponent, BreadcrumbComponent],
  templateUrl: './user-manual.component.html'
})
export class UserManualComponent implements OnInit {
    
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Notice Board', route: '/notice-board' },
    { label: 'User Manual' },
  ];

  tableColumns: TableColumn[] = [
    { key: 'description', label: 'Description', widthClass: 'col-7' },
    { key: 'publishDate', label: 'Publish Date', widthClass: 'col-2' },
    { key: 'fileUrl', label: 'Download', type: 'download', widthClass: 'col-2' }
  ];

  private noticeService = inject(NoticeService);
  
  documents: UserManualItem[] = [];

  ngOnInit() {
  
    const rawNotices = this.noticeService.getAllByCategory('user-manual');

    this.documents = rawNotices.map((notice, index) => ({
      id: index + 1,
      description: notice.title,
      publishDate: notice.date,
      fileUrl: notice.link
    }));
  }
}