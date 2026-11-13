import { Component,inject } from '@angular/core';

import { AboutSectionComponent } from '../../components/about-section/about-component';
import { StatCardsComponent } from '../../components/stat-cards/stat-cards.component';
import { NoticeBoardComponent } from '../../components/notice-board/notice-board-component';
import { MapSectionComponent } from '../../components/map-section/map-component';
import { QuickLinksComponent } from '../../components/quick-links/quick-links-component';
import { BannerSlider } from './../../../../shared/components/banner-slider/banner-slider.component';
import { WorkGallery } from '../../../../shared/components/work-gallery/work-gallery.component';
import { Announcements } from '../../../../shared/components/announcements/announcements.component';
import { finalize } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AboutSectionComponent,
    // StatCardsComponent,
    // NoticeBoardComponent,
    // MapSectionComponent,
    // QuickLinksComponent,
    BannerSlider,
    WorkGallery,
    Announcements,
  ],
  templateUrl: './home.compnent.html',
  styleUrl: './home.compnent.scss',
})
export class HomeComponent {

  private api = inject(ApiService);

// isLoading = false;


ngOnInit(): void {
    this.loadHomeData();
  }
loadHomeData(): void {

  // this.isLoading = true;

  this.api.get<any>('/front/home')
    .pipe(
      finalize(() => {
        // this.isLoading = false;
      })
    )
    .subscribe({
      next: (res) => {
        console.log('Home API Response:', res);

        // Your existing response handling here
      },
      error: (err) => {
        console.error('Home API Error:', err);
      }
    });
}
  
}
