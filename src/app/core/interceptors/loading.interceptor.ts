import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loaderService = inject(LoaderService);

  console.log('API Started:', req.url);

  loaderService.show();

  return next(req).pipe(
    finalize(() => {
      console.log('API Completed:', req.url);
      loaderService.hide();
      console.log('Loader Status:', loaderService.isLoading());
    })
  );
};