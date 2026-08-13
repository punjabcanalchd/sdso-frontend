import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-org-structure',
  standalone: true,
  imports: [ContentPageComponent, CommonModule],
  templateUrl: './org-chart.component.html',
  styleUrl: './org-chart.component.scss'
})
export class OrgStructureComponent {
  pageTitle = 'Organization Chart';
  
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Organization Chart' }
  ];

  orgChartUrl = 'https://SDSO.punjab.gov.in/images/admin/Organisation chart3.png';
}