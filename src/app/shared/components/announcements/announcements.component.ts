import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoticeBoardComponent } from '../../../modules/website/components/notice-board/notice-board-component';

interface ImportantLink {
  label: string;
  url: string;
  external: boolean;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, NoticeBoardComponent],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss',
})
export class Announcements {
  importantLinks: ImportantLink[] = [
    { label: 'Invest Portal',     url: '#', external: true },
    { label: 'Water Portal',      url: '#', external: true },
    { label: 'Digital India',     url: '#', external: true },
    { label: 'India.gov.in',      url: '#', external: true },
    { label: 'RTI Online Portal', url: '#', external: true },
    { label: 'Grievance',         url: '#', external: true },
  ];
}
