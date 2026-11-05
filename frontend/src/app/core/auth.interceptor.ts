import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'airbnb.token';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token || !request.url.startsWith('/api/')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
