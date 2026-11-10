import { Component } from '@angular/core';

import { AboutSectionComponent } from '../../components/about-section/about-component';
import { StatCardsComponent } from '../../components/stat-cards/stat-cards.component';
import { NoticeBoardComponent } from '../../components/notice-board/notice-board-component';
import { MapSectionComponent } from '../../components/map-section/map-component';
import { QuickLinksComponent } from '../../components/quick-links/quick-links-component';
import { BannerSlider } from './../../../../shared/components/banner-slider/banner-slider.component';
import { WorkGallery } from '../../../../shared/components/work-gallery/work-gallery.component';
import { Announcements } from '../../../../shared/components/announcements/announcements.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AboutSectionComponent,
    StatCardsComponent,
    NoticeBoardComponent,
    MapSectionComponent,
    QuickLinksComponent,
    BannerSlider,
    WorkGallery,
    Announcements
  ],
  templateUrl: './home.compnent.html',
  styleUrl: './home.compnent.scss',
})
export class HomeComponent {}
