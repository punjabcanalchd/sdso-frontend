import { Injectable } from '@angular/core';

export type NoticeTab = 'noticeboard' | 'user-manual' | 'office-orders';

export interface NoticeItem {
  title: string;
  date: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  
  // The Single Source of Truth for all 3 tabs
  private allNotices: Record<NoticeTab, NoticeItem[]> = {
    noticeboard: [
      { title: 'Seventh Ammendment in the Directions 2023, Annexure 1', date: '2026-05-13', link: 'testdownload/sixtam.pdf' },
      { title: 'Request for Offer (RFO) by empaneled banks', date: '2026-03-25', link: '#' },
      { title: 'Request for Quotation for Maruti Ciaz Car- Renewal of Insurance', date: '2026-03-05', link: '#' },
      { title: 'Empanelment of Groundwater Professionals for Preparation of Impact Assessment Reports (IARs) for Sugar Mills', date: '2025-11-21', link: '#' },
      { title: 'Request for Quotation- Renewal of Insurance', date: '2025-04-21', link: '#' },
      { title: 'Request for Quotation regarding AC Service', date: '2025-03-13', link: '#' },
      { title: 'Request for Quotation- Renewal of Insurance', date: '2025-03-06', link: '#' },
      { title: 'Request for Offer RFO by empaneled banks March 2025', date: '2025-02-27', link: '#' },
      { title: 'Request for Offer (RFO) for investment of Rs 2Cr. to 5Cr. by empaneled banks', date: '2025-02-11', link: '#' },
      { title: 'Request for Offer RFO by empaneled banks -Feburary 2025', date: '2025-01-31', link: '#' },
      { title: 'Request for Offer RFO by empaneled banks January 2025', date: '2024-12-30', link: '#' },
      { title: '', date: '', link: '#' },
    ],
    'user-manual': [
      { title: 'User Manual for GW Extraction Portal', date: '2025-01-10', link: '#' },
      { title: 'User Manual for Drilling Rig Application', date: '2024-11-05', link: '#' },
    ],
    'office-orders': [
      { title: 'Office Order – Revised Fee Structure 2025', date: '2025-04-01', link: '#' },
      { title: 'Office Order – Appointment of Web Information Manager', date: '2025-02-15', link: '#' },
    ]
  };

  /** Gets ALL items (Used by the dedicated full pages) */
  getAllByCategory(category: NoticeTab): NoticeItem[] {
    return this.allNotices[category] || [];
  }

  /** Gets limited items (Used by the homepage widget) */
  getLatestByCategory(category: NoticeTab, limit: number = 5): NoticeItem[] {
    return (this.allNotices[category] || []).slice(0, limit);
  }
}