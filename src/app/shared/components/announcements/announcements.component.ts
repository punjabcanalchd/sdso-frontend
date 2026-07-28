import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


interface Announcement {
  date: string;
  title: string;
  url: string;
  isNew: boolean;
}


interface ImportantLink {
  label: string;
  url: string;
  external: boolean;
}

@Component({
  selector: 'app-announcements',
  imports: [CommonModule,RouterLink],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss',
})
export class Announcements {

 annPaused = false;

  // 3s per item — comfortable reading pace
  get annDuration(): string {
    return `${this.announcements.length * 3.5}s`;
  }

    announcements: Announcement[] = [
    { date: '21 Apr 2026', title: 'Announcemnt 1', url: '/announcements/1', isNew: true  },
    { date: '18 Apr 2026', title: 'Announcment 2',  url: '/announcements/2', isNew: true  },
    { date: '15 Apr 2026', title: 'Announcment 3',  url: '/announcements/3', isNew: false },
    { date: '10 Apr 2026', title: 'Announcment 4',  url: '/announcements/4', isNew: false },
    { date: '05 Apr 2026', title: 'Announcment 5',  url: '/announcements/5', isNew: false },
    { date: '05 Apr 2026', title: 'Announcment 6',  url: '/announcements/6', isNew: false },
    { date: '05 Apr 2026', title: 'Announcment 7',  url: '/announcements/7', isNew: false },
  ];

  importantLinks: ImportantLink[] = [
    { label: 'Invest Portal',     url: '#', external: true },
    { label: 'Water Portal',      url: '#', external: true },
    { label: 'Digital India',     url: '#', external: true },
    { label: 'India.gov.in',      url: '#', external: true },
    { label: 'RTI Online Portal', url: '#', external: true },
    { label: 'Grievance',         url: '#', external: true },
  ];
}


