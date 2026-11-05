import { Component, OnInit, inject, signal } from '@angular/core';
import { EmptyState } from '../../components/empty-state';
import { ListingCard } from '../../components/listing-card';
import { Loader } from '../../components/loader';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/error';
import { ListingService } from '../../core/listing.service';
import { Reservation } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-trips-page',
  imports: [ListingCard, Loader, EmptyState],
  template: `
    <div class="page-shell container">
      <div class="page-heading">
        <div>
          <span class="eyebrow">Your journeys</span>
          <h1>Trips</h1>
          <p>Where you've been and where you're going.</p>
        </div>
      </div>

      @if (loading()) {
        <app-loader />
      } @else if (reservations().length === 0) {
        <app-empty-state
          title="No trips yet"
          subtitle="When you book a stay, it will show up here."
        />
      } @else {
        <div class="listing-grid">
          @for (reservation of reservations(); track reservation.id) {
            <app-listing-card
              [data]="reservation.listing"
              [reservation]="reservation"
              actionLabel="Cancel reservation"
              [actionId]="reservation.id"
              [disabled]="deletingId() === reservation.id"
              (acted)="cancel($event)"
            />
          }
        </div>
      }
    </div>
  `,
})
export class TripsPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly listings = inject(ListingService);
  private readonly toast = inject(ToastService);

  readonly reservations = signal<Reservation[]>([]);
  readonly loading = signal(true);
  readonly deletingId = signal('');

  ngOnInit(): void {
    void this.load();
  }

  async cancel(id: string): Promise<void> {
    this.deletingId.set(id);

    try {
      await this.listings.deleteReservation(id);
      this.reservations.update((items) => items.filter((item) => item.id !== id));
      this.toast.success('Reservation cancelled');
    } catch (error) {
      this.toast.error(errorMessage(error, 'Could not cancel the reservation.'));
    } finally {
      this.deletingId.set('');
    }
  }

  private async load(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      this.loading.set(false);
      return;
    }

    try {
      this.reservations.set(await this.listings.getReservations({ userId: user.id }));
    } catch (error) {
      this.toast.error(errorMessage(error, 'Could not load your trips.'));
    } finally {
      this.loading.set(false);
    }
  }
}
