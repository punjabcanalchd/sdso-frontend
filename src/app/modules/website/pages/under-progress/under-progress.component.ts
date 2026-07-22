import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-under-progress',
  standalone: true,
  imports: [ContentPageComponent, RouterLink],
  templateUrl: './under-progress.component.html'
})
export class UnderProgressComponent {
  
  // Generic breadcrumb since it can be accessed from anywhere
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Work in Progress' }
  ];
}