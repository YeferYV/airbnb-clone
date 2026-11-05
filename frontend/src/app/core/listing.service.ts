import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  CreateListing,
  CreateReservation,
  Listing,
  ListingFilters,
  ListingWithUser,
  Reservation,
  User,
} from './models';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private readonly http = inject(HttpClient);

  getListings(filters: ListingFilters = {}): Promise<Listing[]> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }

    return firstValueFrom(this.http.get<Listing[]>('/api/listings', { params }));
  }

  getListing(id: string): Promise<ListingWithUser> {
    return firstValueFrom(this.http.get<ListingWithUser>(`/api/listings/${id}`));
  }

  createListing(listing: CreateListing): Promise<Listing> {
    return firstValueFrom(this.http.post<Listing>('/api/listings', listing));
  }

  deleteListing(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`/api/listings/${id}`));
  }

  getFavorites(): Promise<Listing[]> {
    return firstValueFrom(this.http.get<Listing[]>('/api/favorites'));
  }

  addFavorite(listingId: string): Promise<User> {
    return firstValueFrom(this.http.post<User>(`/api/favorites/${listingId}`, {}));
  }

  removeFavorite(listingId: string): Promise<User> {
    return firstValueFrom(this.http.delete<User>(`/api/favorites/${listingId}`));
  }

  getReservations(filters: {
    listingId?: string;
    userId?: string;
    authorId?: string;
  }): Promise<Reservation[]> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, value);
      }
    }

    return firstValueFrom(this.http.get<Reservation[]>('/api/reservations', { params }));
  }

  createReservation(reservation: CreateReservation): Promise<Reservation> {
    return firstValueFrom(this.http.post<Reservation>('/api/reservations', reservation));
  }

  deleteReservation(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`/api/reservations/${id}`));
  }
}
