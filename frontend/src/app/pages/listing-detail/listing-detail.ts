import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Avatar } from '../../components/avatar';
import { EmptyState } from '../../components/empty-state';
import { HeartButton } from '../../components/heart-button';
import { AppIcon } from '../../components/icon';
import { Loader } from '../../components/loader';
import { MapView } from '../../components/map';
import { AuthService } from '../../core/auth.service';
import { findCategory } from '../../core/categories';
import { countryLabel, flagUrl, getCountry } from '../../core/countries';
import {
  addDaysInput,
  dateInputToIso,
  formatRange,
  nightsBetween,
  todayInput,
} from '../../core/dates';
import { errorMessage } from '../../core/error';
import { ListingService } from '../../core/listing.service';
import { ListingWithUser, Reservation } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { UiService } from '../../core/ui.service';

@Component({
  selector: 'app-listing-detail-page',
  imports: [
    RouterLink,
    Avatar,
    EmptyState,
    HeartButton,
    AppIcon,
    Loader,
    MapView,
  ],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.css',
})
export class ListingDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listingsService = inject(ListingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  readonly auth = inject(AuthService);
  readonly ui = inject(UiService);

  readonly listing = signal<ListingWithUser | null>(null);
  readonly reservations = signal<Reservation[]>([]);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly busy = signal(false);
  readonly reservationError = signal('');
  readonly imageFailed = signal(false);

  readonly today = todayInput();
  readonly checkIn = signal(addDaysInput(todayInput(), 1));
  readonly checkOut = signal(addDaysInput(todayInput(), 3));

  readonly category = computed(() => findCategory(this.listing()?.category));
  readonly location = computed(() => countryLabel(this.listing()?.locationValue));
  readonly flag = computed(() => flagUrl(this.listing()?.locationValue));
  readonly center = computed(() => getCountry(this.listing()?.locationValue)?.latlng);

  readonly nights = computed(() => nightsBetween(this.checkIn(), this.checkOut()));
  readonly totalPrice = computed(() => (this.listing()?.price ?? 0) * this.nights());
  readonly minCheckOut = computed(() => addDaysInput(this.checkIn(), 1));
  readonly unavailable = computed(() => this.rangeOverlaps(this.checkIn(), this.checkOut()));
  readonly dateError = computed(() => {
    if (this.checkIn() < this.today) {
      return 'The check-in date cannot be in the past.';
    }
    if (this.checkOut() <= this.checkIn()) {
      return 'Check-out must be after check-in.';
    }
    if (this.unavailable()) {
      return 'Those dates are already reserved. Choose another range.';
    }
    return '';
  });
  readonly canReserve = computed(
    () => !!this.listing() && !this.busy() && !this.dateError(),
  );

  readonly occupied = computed(() =>
    this.reservations().map((reservation) => ({
      id: reservation.id,
      label: formatRange(reservation.startDate, reservation.endDate),
    })),
  );

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('listingId');
        if (id) {
          void this.load(id);
        }
      });
  }

  onCheckIn(value: string): void {
    this.checkIn.set(value);
    if (this.checkOut() <= value) {
      this.checkOut.set(addDaysInput(value, 2));
    }
    this.reservationError.set('');
  }

  onCheckOut(value: string): void {
    this.checkOut.set(value);
    this.reservationError.set('');
  }

  async reserve(): Promise<void> {
    const listing = this.listing();
    if (!listing) {
      return;
    }

    if (!this.auth.isAuthenticated()) {
      this.ui.openAuth('login');
      return;
    }

    if (this.dateError()) {
      this.reservationError.set(this.dateError());
      return;
    }

    this.busy.set(true);
    this.reservationError.set('');

    try {
      await this.listingsService.createReservation({
        listingId: listing.id,
        startDate: dateInputToIso(this.checkIn()),
        endDate: dateInputToIso(this.checkOut()),
        totalPrice: this.totalPrice(),
      });

      this.toast.success('Your stay is booked');
      await this.router.navigate(['/trips']);
    } catch (error) {
      this.reservationError.set(errorMessage(error, 'Could not reserve these dates.'));
    } finally {
      this.busy.set(false);
    }
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    this.notFound.set(false);
    this.listing.set(null);
    this.reservations.set([]);

    try {
      const [listing, reservations] = await Promise.all([
        this.listingsService.getListing(id),
        this.listingsService.getReservations({ listingId: id }),
      ]);
      this.listing.set(listing);
      this.reservations.set(reservations);

      const next = reservations
        .map((reservation) => reservation.endDate.slice(0, 10))
        .filter((date) => date >= this.today)
        .sort()[0];

      if (next) {
        this.checkIn.set(addDaysInput(next, 1));
        this.checkOut.set(addDaysInput(next, 3));
      }
    } catch (error) {
      this.notFound.set(true);
      this.toast.error(errorMessage(error, 'Could not load this listing.'));
    } finally {
      this.loading.set(false);
    }
  }

  private rangeOverlaps(checkIn: string, checkOut: string): boolean {
    return this.reservations().some((reservation) => {
      const start = reservation.startDate.slice(0, 10);
      const end = reservation.endDate.slice(0, 10);
      return start < checkOut && end > checkIn;
    });
  }
}
