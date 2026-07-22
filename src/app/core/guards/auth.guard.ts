import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';



@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.auth
      .isAuthenticated$()
      .pipe(
        take(1),
        map(isAuth => {
          // Not logged in
          if (!isAuth) {
            return this.router.createUrlTree([
              '/auth/login'
            ]);
          }

         const roles = route.data['roles'] as string[] | undefined;
          // No role restriction
          if (!roles?.length) {
            return true;
          }

          // Check role
          const hasRole = roles.some(role => this.auth.hasRole(role));
          return hasRole ? true : this.router.createUrlTree(['/unauthorized']);
        })

      );

  }

}