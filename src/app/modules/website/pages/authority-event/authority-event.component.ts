import { Component } from '@angular/core';
import { GalleryComponent, GalleryImage } from '../../../../shared/components/gallery/gallery.component';



@Component({
  selector: 'app-authority-event',
  standalone: true,
  imports: [GalleryComponent],
  templateUrl: './authority-event.component.html',
  styleUrls: ['./authority-event.component.scss']
})
export class AuthorityEventComponent {


  eventDetails = {
    title: 'WORLD WATER DAY 2026',
    description: 'The Punjab Water Regulation and Development Authority (PWRDA), Chandigarh, had organized the World Water Day on 27th March 2026. Total 550+ participants has take part in the event. Some glimpse of the event are:',
    bannerImageUrl: '/mediaGallery/myattachments1.jpg'
  };



}