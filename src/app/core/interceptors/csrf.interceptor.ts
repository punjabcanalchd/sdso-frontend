import { HttpInterceptorFn } from '@angular/common/http';

export const CSRFInterceptor: HttpInterceptorFn = (req, next) => {
  
  let csrfToken = getCookie('csrf_token'); // read cookie manually
  
  if (csrfToken) {
    req = req.clone({
      setHeaders: {
        'X-CSRF-Token': csrfToken
      }
    });
  }

  return next(req);
};

// Helper function to read cookie
function getCookie(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}
