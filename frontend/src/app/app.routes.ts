import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((module) => module.HomePage),
  },
  {
    path: 'listings/:listingId',
    loadComponent: () =>
      import('./pages/listing-detail/listing-detail').then((module) => module.ListingDetailPage),
  },
  {
    path: 'trips',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/trips/trips').then((module) => module.TripsPage),
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/favorites/favorites').then((module) => module.FavoritesPage),
  },
  {
    path: 'reservations',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reservations/reservations').then((module) => module.ReservationsPage),
  },
  {
    path: 'properties',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/properties/properties').then((module) => module.PropertiesPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
