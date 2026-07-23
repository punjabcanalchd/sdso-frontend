import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AccessibilityBarComponent } from '../../shared/components/accessibility-bar/accessibility-bar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TickerComponent } from '../../shared/components/ticker/ticker.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-website-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AccessibilityBarComponent,
    HeaderComponent,
    NavbarComponent,
    TickerComponent,
    FooterComponent,
  ],
  templateUrl: './website-layout.html',
  styleUrl: './website-layout.scss',
})
export class WebsiteLayout {
  logoUrl = 'assets/images/front/logo.png';
}
