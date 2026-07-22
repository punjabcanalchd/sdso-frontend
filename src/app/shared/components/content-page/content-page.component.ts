import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent,BreadcrumbItem } from '../breadcrumb/breadcrumb';


@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent ],
  templateUrl: './content-page.component.html'
 
})
export class ContentPageComponent {
  @Input() title: string = '';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
}