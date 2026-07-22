import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('CSRF Interceptor triggered');
    const csrf = this.getCookie('csrf_token');

    const cloned = req.clone({
      withCredentials: true,
      setHeaders: csrf ? { 'X-CSRF-Token': csrf } : {}
    });

    return next.handle(cloned);
  }

  private getCookie(name: string): string | null {
    const match = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }
}
