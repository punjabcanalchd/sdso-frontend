import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminConfig } from '../models/admin-config.model';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  constructor(private http: HttpClient) {}

  get apiBaseUrl(): string {

    return environment.apiUrl;

  }

   getConfig(): Observable<AdminConfig> {
    return this.http.get<AdminConfig>(
      `${this.apiBaseUrl}/admin/config`
    );
  }


}
