import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
// import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
 
  useMapApi: boolean = false; 
  private view: any;

  mapConfig = {
     apiKey: "YOUR_BHARAT_MAPS_API_KEY_HERE",
    latitude: 30.74092288304918,
    longitude: 76.77773475646973,
    zoom: 14
  };
   ngAfterViewInit(): void {
    if (this.useMapApi) {
      this.initializePublicMap();
    }
  }

  
  private initializePublicMap(): void {
    const req = (window as any).require;
    req([
      "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic"
    ], (esriConfig: any, Map: any, MapView: any, Graphic: any) => {
        if (this.mapConfig.apiKey && this.mapConfig.apiKey !== "YOUR_BHARAT_MAPS_API_KEY_HERE") {
        esriConfig.apiKey = this.mapConfig.apiKey;
      }
      console.log(" ArcGIS/BharatMap is drawing the map right now!");
      const map = new Map({
        basemap: "osm"
          });
            this.view = new MapView({
        container: this.mapContainer.nativeElement,
        map: map,
        center: [this.mapConfig.longitude, this.mapConfig.latitude],
        zoom: this.mapConfig.zoom
      });
      const markerSymbol = {
        type: "simple-marker",
        color: [220, 53, 69],  
        outline: {
          color: [255, 255, 255], 
          width: 2
        }
      };
      const pointGraphic = new Graphic({
        geometry: {
          type: "point",
          longitude: this.mapConfig.longitude,
          latitude: this.mapConfig.latitude
        },
        symbol: markerSymbol,
        attributes: {
          TOURISM_NAME: "SDSO Office"
        },
        popupTemplate: {
          title: "{TOURISM_NAME}",
          content: "<b>Location:</b> Sector-17-E, Chandigarh"
        }
      });
      this.view.graphics.add(pointGraphic);
    });
  }

  
 

 ngOnDestroy(): void {
    if (this.view) {
      this.view.destroy();
    }
  }
}