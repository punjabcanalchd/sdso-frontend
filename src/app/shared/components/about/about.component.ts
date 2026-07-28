import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Stat {
  value: string;
  label: string;
}
    
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  stats: Stat[] = [
    { value: '50K+', label: 'Applications Processed' },
    { value: '24/7', label: 'Online Services' },
    { value: '100%', label: 'Digital Workflow' },
    { value: '15+', label: 'Districts Covered' }
  ];
}

