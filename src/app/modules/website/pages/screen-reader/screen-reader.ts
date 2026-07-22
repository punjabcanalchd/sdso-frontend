import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

export interface ScreenReaderEntry {
  name: string;
  website: string;
  url: string;
  free: boolean;
}

@Component({
  selector: 'app-screen-reader',
  standalone: true,
  imports: [BreadcrumbComponent,CommonModule],
  templateUrl: './screen-reader.html',
  styleUrl: './screen-reader.scss',
})
export class ScreenReaderComponent {
  breadcrumb: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Screen Reader' },
  ];

  readers: ScreenReaderEntry[] = [
    {
      name: 'Non Visual Desktop Access (NVDA)',
      website: 'http://www.nvda-project.org/',
      url: 'http://www.nvda-project.org/',
      free: true,
    },
    {
      name: 'Screen Access For All (SAFA)',
      website: 'http://www.nabdelhi.in',
      url: 'http://www.nabdelhi.in',
      free: true,
    },
    {
      name: 'System Access To Go',
      website: 'http://www.satogo.com',
      url: 'http://www.satogo.com',
      free: true,
    },
  ];
}
