import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Footer Image Path
  dataGovLogo = 'assets/images/front/footer/data-gov-logo.png';
  digitalIndiaLogo = 'assets/images/front/footer/digital-india-logo.png';
  imgappStore = 'assets/images/front/footer/img_app_store.png';  
  imgGooglePlay = 'assets/images/front/footer/img_google_play.png';
  meityLogo = 'assets/images/front/footer/Meity_logo.png';
  myGovFooterLogo = 'assets/images/front/footer/mygov-footer-logo.png';
  pmIndiaLogo = 'assets/images/front/footer/pm-india-logo.png';
  qrCodeLogo  = 'assets/images/front/footer/qr_code_logo.png';
  indiaGovLogo  = 'assets/images/front/footer/india-gov-logo.png';


  policyLinks = [
    { path: '/website-policies', label: 'Website Policies' },
    { path: '/mobile-app-policy', label: 'Mobile App Policy' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/web-information-manager', label: 'Web Information Manager' }
  ];
aboutLinks = [
    { path: '/about/chairperson', label: 'Chairperson' },
    { path: '/about/pwrda', label: 'About PWRDA' },
    { path: '/about/org-structure', label: 'Organizational Structure' }
  ];

  serviceLinks = [
    { path: '/services/gw-extraction', label: 'Fee Calculator for Permission of Water Tanker' },
    { path: '/services/drilling-rig', label: 'Fee Calculator For Permission of Drilling Rig' },
    { path: '/services/water-tanker', label: 'Fee Calculator for GW Extraction Charges' }
  ];


}