import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EmptyState } from '../../components/empty-state';
import { ListingCard } from '../../components/listing-card';
import { Loader } from '../../components/loader';
import { errorMessage } from '../../core/error';
import { ListingService } from '../../core/listing.service';
import { Listing, ListingFilters } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-home-page',
  imports: [ListingCard, Loader, EmptyState],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listingsService = inject(ListingService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private requestId = 0;

  readonly listings = signal<Listing[]>([]);
  readonly loading = signal(true);
  readonly hasFilters = signal(false);
  readonly summary = computed(() => {
    const count = this.listings().length;
    return `${count} ${count === 1 ? 'stay' : 'stays'} available`;
  });

  constructor() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => void this.load(params));
  }

  reset(): void {
    void this.router.navigate(['/']);
  }

  private async load(params: ParamMap): Promise<void> {
    const requestId = ++this.requestId;
    const filters = this.toFilters(params);

    this.hasFilters.set(params.keys.length > 0);
    this.loading.set(true);

    try {
      const listings = await this.listingsService.getListings(filters);
      if (requestId === this.requestId) {
        this.listings.set(listings);
      }
    } catch (error) {
      if (requestId === this.requestId) {
        this.listings.set([]);
        this.toast.error(errorMessage(error, 'Could not load listings.'));
      }
    } finally {
      if (requestId === this.requestId) {
        this.loading.set(false);
      }
    }
  }

  private toFilters(params: ParamMap): ListingFilters {
    const filters: ListingFilters = {};
    const category = params.get('category');
    const locationValue = params.get('locationValue');
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    const guestCount = this.toPositiveNumber(params.get('guestCount'));
    const roomCount = this.toPositiveNumber(params.get('roomCount'));
    const bathroomCount = this.toPositiveNumber(params.get('bathroomCount'));

    if (category) {
      filters.category = category;
    }
    if (locationValue) {
      filters.locationValue = locationValue;
    }
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }
    if (guestCount) {
      filters.guestCount = guestCount;
    }
    if (roomCount) {
      filters.roomCount = roomCount;
    }
    if (bathroomCount) {
      filters.bathroomCount = bathroomCount;
    }

    return filters;
  }

  private toPositiveNumber(value: string | null): number | undefined {
    if (!value) {
      return undefined;
    }

    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : undefined;
  }
}
