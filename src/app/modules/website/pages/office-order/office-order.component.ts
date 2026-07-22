import { Component, OnInit, inject } from '@angular/core';
import { NoticeService } from '../../../../shared/services/notice.services';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { BreadcrumbItem, BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb';

export interface OfficeOrderItem {
  id: number;
  description: string;
  publishDate: string;
  fileUrl: string;
}

@Component({
  selector: 'app-office-orders',
  standalone: true,
  imports: [DocumentListComponent, BreadcrumbComponent],
  templateUrl: './office-order.component.html'
})
export class OfficeOrdersComponent implements OnInit {
    
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Notice Board', route: '/notice-board' },
    { label: 'Office Orders' },
  ];

  tableColumns: TableColumn[] = [
    { key: 'description', label: 'Description', widthClass: 'col-7' },
    { key: 'publishDate', label: 'Publish Date', widthClass: 'col-2' },
    { key: 'fileUrl', label: 'Download', type: 'download', widthClass: 'col-2' }
  ];

  private noticeService = inject(NoticeService);
  
  documents: OfficeOrderItem[] = [];

  ngOnInit() {
    const rawNotices = this.noticeService.getAllByCategory('office-orders');

    this.documents = rawNotices.map((notice, index) => ({
      id: index + 1,
      description: notice.title,
      publishDate: notice.date,
      fileUrl: notice.link
    }));
  }
}