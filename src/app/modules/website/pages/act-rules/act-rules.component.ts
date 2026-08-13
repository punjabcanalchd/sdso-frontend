import { Component } from '@angular/core';

import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

export interface ActRuleItem {
  id: number;
  description: string;
  publishDate: string;
  fileUrl: string;
}

@Component({
  selector: 'app-act-rules',
  standalone: true,
  imports: [DocumentListComponent, BreadcrumbComponent],
  templateUrl: './act-rules.component.html',
  styleUrl: './act-rules.component.scss',
})
export class ActRulesComponent {
  breadcrumb: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Notice Board', route: '/notice-board' },
    { label: 'Act and Rules' },
  ];

  tableColumns: TableColumn[] = [
    { key: 'description', label: 'Description', widthClass: 'col-7' },
    { key: 'publishDate', label: 'Publish Date', widthClass: 'col-2' },
    { key: 'fileUrl', label: 'Download', type: 'download', widthClass: 'col-2' }
  ];

  documents: ActRuleItem[] = [
    {
      id: 1,
      description: 'Sixth Amendment to The Punjab Groundwater Extraction and Conservation Directions 2023',
      publishDate: '2026-02-26',
      fileUrl: '/testdownload/sixtham.pdf',
    },
    {
      id: 2,
      description: 'Punjab Water Resources (Management and Regulation) Amendment Act, 2025',
      publishDate: '2025-03-20',
      fileUrl: '#',
    },
    {
      id: 3,
      description: 'Punjab Directions for Sustainable Management of Ponds 2025',
      publishDate: '2025-01-09',
      fileUrl: '#',
    },
    {
      id: 4,
      description: 'Fifth Amendment to The Punjab Groundwater Extraction and Conservation Directions 2023',
      publishDate: '2024-06-06',
      fileUrl: '#',
    },
    {
      id: 5,
      description: 'Fourth Amendment to The Punjab Groundwater Extraction and Conservation Directions 2023',
      publishDate: '2024-02-15',
      fileUrl: '#',
    },
    {
      id: 6,
      description: 'Third Amendment to The Punjab Groundwater Extraction and Conservation Directions, 2023',
      publishDate: '2023-10-18',
      fileUrl: '#',
    },
    {
      id: 7,
      description: 'Amendment to The Punjab Groundwater Extraction and Conservation Directions, 2023',
      publishDate: '2023-08-31',
      fileUrl: '#',
    },
    {
      id: 8,
      description: 'Amendment to The Punjab Groundwater Extraction and Conservation Directions, 2023',
      publishDate: '2023-06-19',
      fileUrl: '#',
    },
    {
      id: 9,
      description: 'The Punjab Groundwater Extraction and Conservation Directions, 2023',
      publishDate: '2023-02-01',
      fileUrl: '#',
    },
    {
      id: 10,
      description: 'Punjab Water Resources (Management and Regulation) Act, 2020',
      publishDate: '2020-11-05',
      fileUrl: '#',
    },
    {
      id: 11,
      description: 'Punjab Water Resources (Management and Regulation) Rules, 2021',
      publishDate: '2021-04-12',
      fileUrl: '#',
    },
    {
      id: 12,
      description: 'Groundwater Charges Notification under SDSO Act 2020',
      publishDate: '2023-03-31',
      fileUrl: '#',
    },
  ];
}