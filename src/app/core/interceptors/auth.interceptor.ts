import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  catchError,
  throwError
} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (

  req,
  next

) => {

  const cloned = req.clone({

    withCredentials: true

  });

  return next(cloned).pipe(

    catchError((error: HttpErrorResponse) => {

      // Ignore expected guest auth checks
      if (

        error.status === 401 &&

        req.url.includes('/auth/user')

      ) {

        return throwError(() => error);

      }

      // Handle real expired sessions
      if (error.status === 401) {

        console.log('Unauthorized');

      }

      return throwError(() => error);

    })

  );

};