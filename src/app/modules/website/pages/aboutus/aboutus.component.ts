import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ContentPageComponent, CommonModule],
  templateUrl: './aboutus.component.html'
})
export class AboutComponent {
  pageTitle = 'About SDSO';
  
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'About Us' },
    { label: 'About SDSO' }
  ];

  // Simply drop your paragraphs of text into this array once you have them!
  aboutParagraphs: string[] = [
    "The Punjab Water Regulation and Development Authority (SDSO) constituted under the Punjab Water Resources Regulation and Management Act, 2020 is mandated to regulate the water resources of the state for ensuring its judicious, equitable and sustainable utilisation and management.",
    "The Authority aims to manage and regulate water usage in the state so as to achieve sustainable management of groundwater balanced with the requirements of the livelihoods of people of the state.",
    "The conservation of water is to be mandated for all users of groundwater by encouraging them to undertake, at their own cost, water conservation measures that will help to achieve the set target for conservation for each zone in the state.",
    "In case the water users are not able to execute water conservation measures to meet their target, then they shall not be given the water credits to that extent, and they shall be liable to pay this amount to the Authority as part of his/her groundwater usage charges. A portion of the groundwater charges received will be utilised by the Authority for implementing Water Conservation Schemes to be framed by the government and to be executed by the concerned departments or public agencies nominated by government. The objective shall be to ensure sufficient water conservation to meet the targets set for each user in the state."
  ];
}