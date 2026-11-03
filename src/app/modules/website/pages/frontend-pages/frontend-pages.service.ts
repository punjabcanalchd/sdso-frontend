import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { LanguageService } from '../../../../core/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class FrontendPagesService {
  private api = inject(ApiService);
  private languageService = inject(LanguageService);

  // getPage(pageId: number, languageId: number) {
  //   const langId = this.languageService.getCurrentLanguageId();
  //   return this.api.get<any>(
  //     `/front/pages/${pageId}/${langId}`
  //   );
  // }

  getPage(pageId: number, languageId: number) {
  return this.api.get<any>(
    `/front/pages/${pageId}/${languageId}`
  );
}


 // Update this method to accept both id and languageId
  getNoticeboard(id: number, languageId: number) {
    const langId = this.languageService.getCurrentLanguageId();
    return this.api.get<any>(
      `/front/noticeboard/${langId}/${id}`
    );
  }

}
