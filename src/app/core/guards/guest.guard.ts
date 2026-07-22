import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})

export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router ) {
    
   }
  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.isAuthenticated$().pipe(take(1), map(isAuth => isAuth ? this.router.createUrlTree(['/account/dashboard']) : true));
  }

}