import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { LanguageService } from '../../../../core/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class FrontendPagesService {
  private api = inject(ApiService);
  private languageService = inject(LanguageService);

  
  getHomeSliders() {
    return this.api.get<any>('/front/sliders');
  }


  getPage(pageId: number, languageId: number) {
  return this.api.get<any>(
    `/front/pages/${pageId}/${languageId}`
  );
}

  getNoticeboard(id: number, languageId: number) {
    return this.api.get<any>(
      `/front/noticeboard/${languageId}/${id}`
    );
 }


}
