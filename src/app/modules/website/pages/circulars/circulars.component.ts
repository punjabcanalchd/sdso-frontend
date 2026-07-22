import { Component } from '@angular/core';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { BreadcrumbItem, BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb';

export interface CircularItem {
  id: number;
  description: string;
  publishDate: string;
  fileUrl: string;
}

@Component({
  selector: 'app-circulars',
  standalone: true,
  imports: [DocumentListComponent, BreadcrumbComponent],
  templateUrl: './circulars.component.html'
})
export class CircularsComponent {
    
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Circulars' },
  ];

  tableColumns: TableColumn[] = [
    { key: 'description', label: 'Description', widthClass: 'col-7' },
    { key: 'publishDate', label: 'Publish Date', widthClass: 'col-2' },
    { key: 'fileUrl', label: 'Download', type: 'download', widthClass: 'col-2' }
  ];

  documents: CircularItem[] = [
    { 
      id: 1, 
      description: 'Circular regarding Water Audit Guidelines for Industries', 
      publishDate: '2026-05-10', 
      fileUrl: '#' 
    },
    { 
      id: 2, 
      description: 'Circular on Mandatory Registration of Boring Machines', 
      publishDate: '2026-04-15', 
      fileUrl: '#' 
    },
    { 
      id: 3, 
      description: 'Guidelines for Rainwater Harvesting Implementations', 
      publishDate: '2026-01-22', 
      fileUrl: '#' 
    }
  ];
}