import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private apiService: ApiService) {}

  getPages(params: Record<string, any>): Observable<any> {
    return this.apiService.get<any>('/pages', params);
  }

  getPageByPublicId(publicId: string): Observable<any> {
    return this.apiService.get<any>(
      `/pages/${publicId}`
    );
  }
}
