import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { countryLabel } from '../core/countries';
import { formatRange } from '../core/dates';
import { Listing, Reservation } from '../core/models';
import { HeartButton } from './heart-button';

@Component({
  selector: 'app-listing-card',
  imports: [HeartButton],
  template: `
    <article class="card" (click)="open()">
      <div class="card-image">
        @if (!imageFailed()) {
          <img [src]="data().imageSrc" [alt]="data().title" loading="lazy" (error)="imageFailed.set(true)" />
        } @else {
          <img src="/images/placeholder.jpg" [alt]="data().title" />
        }
        <div class="heart">
          <app-heart-button [listingId]="data().id" />
        </div>
      </div>

      <div class="card-body">
        <div class="card-topline">
          <h3>{{ location() }}</h3>
          <span class="rating">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1Z" />
            </svg>
            4.9
          </span>
        </div>
        <p class="card-sub">{{ subtitle() }}</p>
        <p class="card-price">
          <strong>{{ '$' + price() }}</strong>
          @if (!reservation()) {
            <span> night</span>
          }
        </p>
      </div>

      @if (actionLabel()) {
        <button
          type="button"
          class="btn btn-outline card-action"
          [disabled]="disabled()"
          (click)="onAction($event)"
        >
          {{ disabled() ? 'Working...' : actionLabel() }}
        </button>
      }
    </article>
  `,
  styles: `
    .card {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 10px;
      cursor: pointer;
    }

    .card-image {
      position: relative;
      overflow: hidden;
      aspect-ratio: 1 / 1;
      border-radius: 18px;
      background: #edf0ec;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 350ms ease;
    }

    .card:hover .card-image img {
      transform: scale(1.055);
    }

    .heart {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 0 2px;
    }

    .card-topline {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .card-topline h3 {
      overflow: hidden;
      margin: 0;
      font-size: 0.96rem;
      font-weight: 750;
      line-height: 1.35;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .rating {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: #424746;
      font-size: 0.82rem;
      font-weight: 600;
    }

    .rating svg {
      width: 13px;
      height: 13px;
      fill: currentColor;
    }

    .card-sub {
      overflow: hidden;
      margin: 0;
      color: var(--muted);
      font-size: 0.9rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-price {
      margin: 3px 0 0;
      font-size: 0.94rem;
    }

    .card-price strong {
      font-weight: 750;
    }

    .card-action {
      margin-top: 4px;
    }
  `,
})
export class ListingCard {
  private readonly router = inject(Router);

  readonly data = input.required<Listing>();
  readonly reservation = input<Reservation | null>(null);
  readonly actionLabel = input('');
  readonly actionId = input<string | undefined>(undefined);
  readonly disabled = input(false);

  readonly acted = output<string>();
  readonly imageFailed = signal(false);

  readonly location = computed(() => countryLabel(this.data().locationValue));
  readonly price = computed(() => this.reservation()?.totalPrice ?? this.data().price);
  readonly subtitle = computed(() => {
    const reservation = this.reservation();
    if (reservation) {
      return formatRange(reservation.startDate, reservation.endDate);
    }

    return this.data().category;
  });

  open(): void {
    void this.router.navigate(['/listings', this.data().id]);
  }

  onAction(event: MouseEvent): void {
    event.stopPropagation();
    this.acted.emit(this.actionId() ?? this.data().id);
  }
}
