import { Component } from '@angular/core';

import { AboutSectionComponent } from '../../components/about-section/about-component';
import { StatCardsComponent } from '../../components/stat-cards/stat-cards.component';
import { NoticeBoardComponent } from '../../components/notice-board/notice-board-component';
import { MapSectionComponent } from '../../components/map-section/map-component';
import { QuickLinksComponent } from '../../components/quick-links/quick-links-component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AboutSectionComponent,
    StatCardsComponent,
    NoticeBoardComponent,
    MapSectionComponent,
    QuickLinksComponent,
  ],
  templateUrl: './home.compnent.html',
  styleUrl: './home.compnent.scss',
})
export class HomeComponent {}
