import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface QuickLink {
  id: string;
  label: string;
  icon: string;
  route: string;
  bgClass: string;   
  textClass: string;
}

@Component({
  selector: 'app-quick-links',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quick-links-component.html',
  styleUrl: './quick-links-component.scss',
})
export class QuickLinksComponent {
  
  quickLinks: QuickLink[] = [
    {
      id: 'media-news',
      label: 'Media & News',
      icon: 'bi-newspaper',
      route: '/gallery',
      bgClass: 'bg-primary', // Solid Blue
      textClass: 'text-white'
    },
    {
      id: 'act-rules',
      label: 'Act and Rules',
      icon: 'bi-file-earmark-text',
      route: '/act-rules',
      bgClass: 'bg-danger', // Solid Red
      textClass: 'text-white'
    },
    {
      id: 'notifications',
      label: 'Notification & Circulars',
      icon: 'bi-bell',
      route: '/noticeboard/circulars',
      bgClass: 'bg-info', // Solid Cyan
      textClass: 'text-white'
    },
    {
      id: 'tenders',
      label: 'Tenders',
      icon: 'bi-search',
      route: '/cons',
      bgClass: 'bg-warning', // Solid Yellow
      textClass: 'text-white'
    },
  ];
}