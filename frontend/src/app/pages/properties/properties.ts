import { Component, OnInit, inject, signal } from '@angular/core';
import { EmptyState } from '../../components/empty-state';
import { ListingCard } from '../../components/listing-card';
import { Loader } from '../../components/loader';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/error';
import { ListingService } from '../../core/listing.service';
import { Listing } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-properties-page',
  imports: [ListingCard, Loader, EmptyState],
  template: `
    <div class="page-shell container">
      <div class="page-heading">
        <div>
          <span class="eyebrow">Host dashboard</span>
          <h1>Properties</h1>
          <p>List of your properties.</p>
        </div>
      </div>

      @if (loading()) {
        <app-loader />
      } @else if (items().length === 0) {
        <app-empty-state
          title="No properties found"
          subtitle="Use “Airbnb your home” to publish your first stay."
        />
      } @else {
        <div class="listing-grid">
          @for (listing of items(); track listing.id) {
            <app-listing-card
              [data]="listing"
              actionLabel="Delete property"
              [actionId]="listing.id"
              [disabled]="deletingId() === listing.id"
              (acted)="remove($event)"
            />
          }
        </div>
      }
    </div>
  `,
})
export class PropertiesPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly listings = inject(ListingService);
  private readonly toast = inject(ToastService);

  readonly items = signal<Listing[]>([]);
  readonly loading = signal(true);
  readonly deletingId = signal('');

  ngOnInit(): void {
    void this.load();
  }

  async remove(id: string): Promise<void> {
    this.deletingId.set(id);

    try {
      await this.listings.deleteListing(id);
      this.items.update((listings) => listings.filter((listing) => listing.id !== id));
      this.toast.success('Listing deleted');
    } catch (error) {
      this.toast.error(errorMessage(error, 'Could not delete the listing.'));
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
      this.items.set(await this.listings.getListings({ userId: user.id }));
    } catch (error) {
      this.toast.error(errorMessage(error, 'Could not load your properties.'));
    } finally {
      this.loading.set(false);
    }
  }
}
