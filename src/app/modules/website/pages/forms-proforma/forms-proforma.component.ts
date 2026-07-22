import { Component } from '@angular/core';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { BreadcrumbItem, BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb';

export interface FormItem {
  id: number;
  description: string;
  publishDate: string;
  fileUrl: string;
}

@Component({
  selector: 'app-forms-performa',
  standalone: true,
  imports: [DocumentListComponent, BreadcrumbComponent],
  templateUrl: './forms-proforma.component.html'
})
export class FormsPerformaComponent {
    
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Forms & Performa' },
  ];

  tableColumns: TableColumn[] = [
    { key: 'description', label: 'Description', widthClass: 'col-7' },
    { key: 'publishDate', label: 'Publish Date', widthClass: 'col-2' },
    { key: 'fileUrl', label: 'Download', type: 'download', widthClass: 'col-2' }
  ];

  documents: FormItem[] = [
    { 
      id: 1, 
      description: 'Application Form for Ground Water Extraction', 
      publishDate: '2026-06-01', 
      fileUrl: '#' 
    },
    { 
      id: 2, 
      description: 'Performa for Renewal of NOC', 
      publishDate: '2026-05-20', 
      fileUrl: '#' 
    },
    { 
      id: 3, 
      description: 'Self-Declaration Form for Exempted Categories', 
      publishDate: '2026-03-15', 
      fileUrl: '#' 
    },
    { 
      id: 4, 
      description: 'Registration Form for Drilling Rig Operators', 
      publishDate: '2026-01-10', 
      fileUrl: '#' 
    }
  ];
}