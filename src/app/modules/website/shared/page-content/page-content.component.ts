
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-content.component.html',
  styleUrl: './page-content.component.scss'
})
export class PageContentComponent {
  @Input() title: string = '';
  @Input() description: string = '';

}