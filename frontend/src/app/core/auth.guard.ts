import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const ui = inject(UiService);
  const router = inject(Router);

  await auth.ensureLoaded();

  if (auth.isAuthenticated()) {
    return true;
  }

  ui.openAuth('login');
  return router.createUrlTree(['/']);
};
