import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoticeService, NoticeTab, NoticeItem } from '../../../../shared/services/notice.services'

@Component({
  selector: 'app-notice-board',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notice-board-component.html',
  styleUrl: './notice-board-component.scss',
})
export class NoticeBoardComponent implements OnInit {
  private noticeService = inject(NoticeService);

  activeTab: NoticeTab = 'noticeboard';
  currentNotices: NoticeItem[] = [];

  // Added 'route' mapping so the View More button knows where to go
  tabs: { id: NoticeTab; label: string; route: string }[] = [
    { id: 'noticeboard', label: 'Noticeboard', route: '/notice' },
    { id: 'user-manual', label: 'User Manual', route: '/user-manual' },
    { id: 'office-orders', label: 'Office Orders', route: '/noticeboard/office-order' },
  ];

  ngOnInit(): void {
    this.loadNotices();
  }

  setTab(tab: NoticeTab): void {
    this.activeTab = tab;
    this.loadNotices();
  }

  private loadNotices(): void {
    // Fetches only the top 5 recent notices for the homepage view
    this.currentNotices = this.noticeService.getLatestByCategory(this.activeTab, 5);
  }

  // Dynamically grabs the route for the currently active tab
  get activeRoute(): string {
    return this.tabs.find(t => t.id === this.activeTab)?.route || '/';
  }
}