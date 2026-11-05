import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { EmptyState } from '../../components/empty-state';
import { ListingCard } from '../../components/listing-card';
import { Loader } from '../../components/loader';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/error';
import { ListingService } from '../../core/listing.service';
import { Listing } from '../../core/models';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-favorites-page',
  imports: [ListingCard, Loader, EmptyState],
  template: `
    <div class="page-shell container">
      <div class="page-heading">
        <div>
          <span class="eyebrow">Saved for later</span>
          <h1>Favorites</h1>
          <p>Places you have favorited.</p>
        </div>
      </div>

      @if (loading()) {
        <app-loader />
      } @else if (visibleListings().length === 0) {
        <app-empty-state
          title="No favorites found"
          subtitle="Tap the heart on any stay to save it here."
        />
      } @else {
        <div class="listing-grid">
          @for (listing of visibleListings(); track listing.id) {
            <app-listing-card [data]="listing" />
          }
        </div>
      }
    </div>
  `,
})
export class FavoritesPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly listings = inject(ListingService);
  private readonly toast = inject(ToastService);

  readonly items = signal<Listing[]>([]);
  readonly loading = signal(true);
  readonly visibleListings = computed(() => {
    const favoriteIds = this.auth.user()?.favoriteIds ?? [];
    return this.items().filter((listing) => favoriteIds.includes(listing.id));
  });

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      this.items.set(await this.listings.getFavorites());
    } catch (error) {
      this.toast.error(errorMessage(error, 'Could not load your favorites.'));
    } finally {
      this.loading.set(false);
    }
  }
}
