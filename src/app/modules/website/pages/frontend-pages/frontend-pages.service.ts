import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';


@Injectable({
  providedIn: 'root'
})
export class FrontendPagesService {
  private api = inject(ApiService);

  getPage(pageId: number, languageId: number) {
    return this.api.get<any>(
      `/front/pages/${pageId}/${languageId}`
    );
  }
}