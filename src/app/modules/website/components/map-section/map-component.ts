import { Component } from '@angular/core';


@Component({
  selector: 'app-map-section',
  standalone: true,
  imports: [],
  templateUrl: './map-component.html',
  styleUrl: './map-component.scss',
})
export class MapSectionComponent {
 
isModalOpen: boolean = false;
  
  // Track our 2-step zoom state
  isZoomedIn: boolean = false;

  openModal() {
    this.isModalOpen = true;
    this.isZoomedIn = false; // Always reset to 'Fit' view when opening
    document.body.classList.add('overflow-hidden'); 
  }

  closeModal() {
    this.isModalOpen = false;
    this.isZoomedIn = false; 
    document.body.classList.remove('overflow-hidden');
  }

  toggleZoom() {
    this.isZoomedIn = !this.isZoomedIn;
  }
}