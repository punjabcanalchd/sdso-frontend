import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkGallery } from '../../shared/components/work-gallery/work-gallery.component';
import { BannerSlider } from '../../shared/components/banner-slider/banner-slider.component';
import { AboutComponent } from '../../shared/components/about/about.component';
import { Announcements } from '../../shared/components/announcements/announcements.component';
import { AccessibilityBarComponent } from '../../shared/components/accessibility-bar/accessibility-bar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TickerComponent } from '../../shared/components/ticker/ticker.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';


@Component({
  selector: 'app-website-layout',
  standalone: true,
  imports: [
    
    AccessibilityBarComponent,
    HeaderComponent,   
    TickerComponent,
    FooterComponent,
    AboutComponent,
    Announcements,
    BannerSlider,
    WorkGallery
  ],
  templateUrl: './website-layout.html',
  styleUrl: './website-layout.scss',
})
export class WebsiteLayout {
  logoUrl = 'assets/images/front/logo.png';
}
