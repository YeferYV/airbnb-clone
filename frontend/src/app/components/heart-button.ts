import { Component, computed, inject, input, signal } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/error';
import { ListingService } from '../core/listing.service';
import { ToastService } from '../core/toast.service';
import { UiService } from '../core/ui.service';

@Component({
  selector: 'app-heart-button',
  template: `
    <button
      type="button"
      class="heart-button"
      [class.is-favorite]="hasFavorited()"
      [disabled]="busy()"
      [attr.aria-label]="hasFavorited() ? 'Remove from favorites' : 'Add to favorites'"
      (click)="toggle($event)"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
        />
      </svg>
    </button>
  `,
  styles: `
    .heart-button {
      display: grid;
      width: 38px;
      height: 38px;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      color: rgba(45, 48, 47, 0.55);
      cursor: pointer;
      transition:
        transform 160ms ease,
        color 160ms ease,
        background 160ms ease;
    }

    .heart-button:hover {
      transform: scale(1.08);
      background: #fff;
    }

    .heart-button:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    svg {
      width: 21px;
      height: 21px;
      fill: transparent;
      stroke: currentColor;
      stroke-width: 2;
    }

    .is-favorite {
      color: var(--rose);
    }

    .is-favorite svg {
      fill: currentColor;
    }
  `,
})
export class HeartButton {
  private readonly auth = inject(AuthService);
  private readonly listings = inject(ListingService);
  private readonly toast = inject(ToastService);
  private readonly ui = inject(UiService);

  readonly listingId = input.required<string>();
  readonly busy = signal(false);

  readonly hasFavorited = computed(
    () => this.auth.user()?.favoriteIds.includes(this.listingId()) ?? false,
  );

  async toggle(event: MouseEvent): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    if (!this.auth.isAuthenticated()) {
      this.ui.openAuth('login');
      return;
    }

    this.busy.set(true);

    try {
      const user = this.hasFavorited()
        ? await this.listings.removeFavorite(this.listingId())
        : await this.listings.addFavorite(this.listingId());

      this.auth.updateUser(user);
      this.toast.success(this.hasFavorited() ? 'Saved to favorites' : 'Removed from favorites');
    } catch (error) {
      this.toast.error(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }
}
