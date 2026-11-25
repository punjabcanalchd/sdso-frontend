import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DynamicTranslateLoader implements TranslateLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string): Observable<Record<string, any>> {
    const language = (lang || 'en').toLowerCase();
    const url = `${environment.apiUrl}/front/translations/${language}`;

    return this.http.get<any>(url).pipe(
      map(res => {
        if (res && res.data && typeof res.data === 'object') {
          return res.data;
        }
        return res && typeof res === 'object' ? res : {};
      }),
      catchError(err => {
        console.error(`[DynamicTranslateLoader] Failed to fetch dynamic translations for "${lang}" from ${url}:`, err);
        return of({});
      })
    );
  }
}
