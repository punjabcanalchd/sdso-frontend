import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service'; // runtime config


@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {

  }


  

  private get baseUrl(): string {
    // console.log('API Base URL:', this.config.apiBaseUrl);
    return this.config.apiBaseUrl; // use runtime-loaded value
  }
 ;
  get<T>(url: string, params?: Record<string, any>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, {
      params: new HttpParams({ fromObject: params }),
      withCredentials: true
    });
  }
  /** RAW GET (Blob, ArrayBuffer, etc.) */
  getRaw(
    url: string,
    options: {
      responseType: 'blob';
      observe: 'response';
      params?: HttpParams;
      headers?: HttpHeaders;
    }
  ): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}${url}`, {
      ...options
    });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body, {
      withCredentials: true
    });
  }


  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body, {
      withCredentials: true
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`, {
      withCredentials: true
    });
  }
}
