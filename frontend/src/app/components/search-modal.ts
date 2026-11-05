import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { COUNTRIES, getCountry } from '../core/countries';
import { addDaysInput, dateInputToIso, todayInput } from '../core/dates';
import { UiService } from '../core/ui.service';
import { Counter } from './counter';
import { AppIcon } from './icon';
import { MapView } from './map';
import { Modal } from './modal';

@Component({
  selector: 'app-search-modal',
  imports: [Modal, AppIcon, Counter, MapView],
  template: `
    <app-modal
      [isOpen]="ui.searchOpen()"
      title="Filters"
      [actionLabel]="step() === 2 ? 'Search' : 'Next'"
      [secondaryLabel]="step() > 0 ? 'Back' : undefined"
      (closed)="close()"
      (action)="advance()"
      (secondary)="back()"
    >
      <div class="step-track">
        @for (label of steps; track label; let index = $index) {
          <span [class.active]="index <= step()">{{ label }}</span>
        }
      </div>

      @switch (step()) {
        @case (0) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>Where do you want to go?</h3>
              <p>Find the perfect location for your next stay.</p>
            </div>

            <label class="field">
              <span>Country</span>
              <select [value]="locationValue()" (change)="locationValue.set($any($event.target).value)">
                <option value="">Anywhere</option>
                @for (country of countries; track country.value) {
                  <option [value]="country.value">{{ country.label }}</option>
                }
              </select>
            </label>

            <app-map [center]="center()" />
          </div>
        }
        @case (1) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>When do you plan to go?</h3>
              <p>Make sure the dates work for everyone.</p>
            </div>

            <div class="two-col">
              <label class="field">
                <span>Check in</span>
                <input type="date" [min]="today" [value]="checkIn()" (change)="onCheckIn($any($event.target).value)" />
              </label>
              <label class="field">
                <span>Check out</span>
                <input
                  type="date"
                  [min]="checkIn()"
                  [value]="checkOut()"
                  (change)="checkOut.set($any($event.target).value)"
                />
              </label>
            </div>

            <div class="hint-box">
              <app-icon name="calendar" [size]="18" />
              <span>Showing stays available between {{ checkIn() }} and {{ checkOut() }}.</span>
            </div>
          </div>
        }
        @case (2) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>Who is coming?</h3>
              <p>Tell us about your group and the space you need.</p>
            </div>

            <app-counter
              title="Guests"
              subtitle="How many guests are coming?"
              [value]="guestCount()"
              (valueChange)="guestCount.set($event)"
            />
            <app-counter
              title="Rooms"
              subtitle="How many rooms do you need?"
              [value]="roomCount()"
              (valueChange)="roomCount.set($event)"
            />
            <app-counter
              title="Bathrooms"
              subtitle="How many bathrooms do you need?"
              [value]="bathroomCount()"
              (valueChange)="bathroomCount.set($event)"
            />
          </div>
        }
      }
    </app-modal>
  `,
  styles: `
    .step-track {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }

    .step-track span {
      flex: 1;
      border-radius: 999px;
      background: #eef0ec;
      padding: 6px 10px;
      color: var(--muted);
      font-size: 0.76rem;
      font-weight: 700;
      text-align: center;
    }

    .step-track .active {
      background: var(--ink);
      color: #fff;
    }

    .step-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .hint-box {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 12px;
      background: #f5f7f3;
      padding: 14px 16px;
      color: var(--muted);
      font-size: 0.88rem;
    }
  `,
})
export class SearchModal {
  private readonly router = inject(Router);
  readonly ui = inject(UiService);

  readonly countries = COUNTRIES;
  readonly steps = ['Location', 'Dates', 'Guests'];
  readonly today = todayInput();

  readonly step = signal(0);
  readonly locationValue = signal('');
  readonly checkIn = signal(todayInput());
  readonly checkOut = signal(addDaysInput(todayInput(), 2));
  readonly guestCount = signal(1);
  readonly roomCount = signal(1);
  readonly bathroomCount = signal(1);

  readonly center = computed(() => getCountry(this.locationValue())?.latlng);

  onCheckIn(value: string): void {
    this.checkIn.set(value);
    if (this.checkOut() <= value) {
      this.checkOut.set(addDaysInput(value, 2));
    }
  }

  advance(): void {
    if (this.step() < 2) {
      this.step.update((value) => value + 1);
      return;
    }

    const currentCategory = this.router.parseUrl(this.router.url).queryParams['category'];
    const queryParams: Record<string, string | number> = {
      guestCount: this.guestCount(),
      roomCount: this.roomCount(),
      bathroomCount: this.bathroomCount(),
      startDate: dateInputToIso(this.checkIn()),
      endDate: dateInputToIso(this.checkOut()),
    };

    if (this.locationValue()) {
      queryParams['locationValue'] = this.locationValue();
    }

    if (currentCategory) {
      queryParams['category'] = currentCategory;
    }

    this.close();
    void this.router.navigate(['/'], { queryParams });
  }

  back(): void {
    if (this.step() > 0) {
      this.step.update((value) => value - 1);
    }
  }

  close(): void {
    this.step.set(0);
    this.ui.closeSearch();
  }
}
