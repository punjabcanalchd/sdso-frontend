import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LanguageService } from './language.service';

export interface GalleryPhoto {
  id: number;
  url: string;
  alt: string;
  title?: string;
  caption?: string;
}

export interface GalleryAlbum {
  id: number;
  public_id?: string;
  title: string;
  title_en?: string;
  title_pb?: string;
  description?: string;
  coverUrl: string;
  cover_url?: string;
  date?: string;
  created_at?: string;
  media_count: number;
  images: GalleryPhoto[];
}

export interface GalleryCategoryTab {
  id: number | string;
  public_id?: string;
  name: string;
  name_en?: string;
  name_pb?: string;
  count?: number;
}

export interface GalleryDataResponse {
  categories: GalleryCategoryTab[];
  albums: GalleryAlbum[];
  active_category_id?: number | string;
  total_albums: number;
  total_photos: number;
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private api = inject(ApiService);
  private languageService = inject(LanguageService);

  /**
   * Fetch dynamic gallery albums and category tabs from backend.
   */
  getGalleryData(categoryId?: string | number): Observable<{ success: boolean; data: GalleryDataResponse }> {
    const isPb = this.languageService.getCurrentLang() === 'pb';
    const languageId = isPb ? 2 : 1;
    const path = categoryId && categoryId !== 'all' ? `/front/gallery/${categoryId}` : '/front/gallery';

    return this.api.get<any>(path, { language_id: languageId });
  }
}
