import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CATEGORIES } from '../core/categories';
import { COUNTRIES, getCountry } from '../core/countries';
import { errorMessage } from '../core/error';
import { ListingService } from '../core/listing.service';
import { ToastService } from '../core/toast.service';
import { UiService } from '../core/ui.service';
import { Counter } from './counter';
import { AppIcon } from './icon';
import { MapView } from './map';
import { Modal } from './modal';

@Component({
  selector: 'app-rent-modal',
  imports: [FormsModule, Modal, AppIcon, Counter, MapView],
  template: `
    <app-modal
      [isOpen]="ui.rentOpen()"
      title="Airbnb your home"
      [actionLabel]="step() === 5 ? 'Create listing' : 'Next'"
      [secondaryLabel]="step() > 0 ? 'Back' : undefined"
      [disabled]="busy()"
      [wide]="true"
      (closed)="close()"
      (action)="advance()"
      (secondary)="back()"
    >
      <div class="step-track">
        @for (label of steps; track label; let index = $index) {
          <span [class.active]="index <= step()" [class.current]="index === step()"></span>
        }
      </div>

      @switch (step()) {
        @case (0) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>Which of these best describes your place?</h3>
              <p>Pick a category so guests know what to expect.</p>
            </div>

            <div class="category-picker">
              @for (category of categories; track category.label) {
                <button
                  type="button"
                  class="category-choice"
                  [class.selected]="categoryValue() === category.label"
                  (click)="categoryValue.set(category.label)"
                >
                  <app-icon [name]="category.icon" [size]="26" />
                  <span>{{ category.label }}</span>
                </button>
              }
            </div>
          </div>
        }
        @case (1) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>Where is your place located?</h3>
              <p>Help guests find you.</p>
            </div>

            <label class="field">
              <span>Country</span>
              <select [value]="locationValue()" (change)="locationValue.set($any($event.target).value)">
                <option value="">Select a country</option>
                @for (country of countries; track country.value) {
                  <option [value]="country.value">{{ country.label }}</option>
                }
              </select>
            </label>

            <app-map [center]="center()" />
          </div>
        }
        @case (2) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>Share some basics about your place</h3>
              <p>What amenities do you have?</p>
            </div>

            <app-counter title="Guests" subtitle="How many guests do you allow?" [value]="guestCount()" (valueChange)="guestCount.set($event)" />
            <app-counter title="Rooms" subtitle="How many rooms do you have?" [value]="roomCount()" (valueChange)="roomCount.set($event)" />
            <app-counter title="Bathrooms" subtitle="How many bathrooms do you have?" [value]="bathroomCount()" (valueChange)="bathroomCount.set($event)" />
          </div>
        }
        @case (3) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>Add a photo of your place</h3>
              <p>Paste a public image URL to show guests what your place looks like.</p>
            </div>

            <label class="field">
              <span>Image URL</span>
              <input name="imageSrc" [ngModel]="imageSrc()" (ngModelChange)="imageSrc.set($event)" placeholder="https://images.unsplash.com/..." />
            </label>

            <div class="image-preview" [class.has-image]="imageSrc()">
              @if (imageSrc()) {
                <img [src]="imageSrc()" alt="Listing preview" (error)="previewFailed.set(true)" />
              } @else {
                <app-icon name="image" [size]="38" />
                <span>Image preview</span>
              }
            </div>
          </div>
        }
        @case (4) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>How would you describe your place?</h3>
              <p>Short and sweet works best.</p>
            </div>

            <label class="field">
              <span>Title</span>
              <input name="title" [ngModel]="title()" (ngModelChange)="title.set($event)" placeholder="A calm retreat by the sea" maxlength="200" />
            </label>

            <label class="field">
              <span>Description</span>
              <textarea name="description" [ngModel]="description()" (ngModelChange)="description.set($event)" rows="5" maxlength="4000" placeholder="What makes your place special?"></textarea>
            </label>
          </div>
        }
        @case (5) {
          <div class="step-content">
            <div class="modal-heading">
              <h3>Now, set your price</h3>
              <p>How much do you charge per night?</p>
            </div>

            <label class="field price-field">
              <span>Price per night (USD)</span>
              <div class="price-input">
                <span>$</span>
                <input name="price" type="number" min="1" [ngModel]="price()" (ngModelChange)="price.set(+$event)" />
              </div>
            </label>

            <div class="summary">
              <div><span>Category</span><strong>{{ categoryValue() }}</strong></div>
              <div><span>Location</span><strong>{{ locationLabel() }}</strong></div>
              <div><span>Capacity</span><strong>{{ guestCount() }} guests · {{ roomCount() }} rooms · {{ bathroomCount() }} baths</strong></div>
              <div><span>Price</span><strong>{{ '$' + price() }} / night</strong></div>
            </div>
          </div>
        }
      }

      @if (error()) {
        <p class="form-error footer-error">{{ error() }}</p>
      }
    </app-modal>
  `,
  styles: `
    .step-track {
      display: flex;
      gap: 6px;
      margin-bottom: 24px;
    }

    .step-track span {
      height: 5px;
      flex: 1;
      border-radius: 999px;
      background: #eceee9;
    }

    .step-track .active {
      background: #9ab3a6;
    }

    .step-track .current {
      background: var(--ink);
    }

    .step-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .category-picker {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .category-choice {
      display: flex;
      min-height: 90px;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      border: 1.5px solid var(--line);
      border-radius: 14px;
      background: #fff;
      padding: 14px;
      color: var(--ink);
      font: inherit;
      font-size: 0.86rem;
      font-weight: 650;
      cursor: pointer;
      transition:
        border-color 150ms ease,
        background 150ms ease;
    }

    .category-choice:hover {
      border-color: #9aa7a0;
    }

    .category-choice.selected {
      border-color: var(--ink);
      background: #f5f7f4;
    }

    .image-preview {
      display: grid;
      min-height: 190px;
      place-items: center;
      overflow: hidden;
      border: 1.5px dashed #cbd2cc;
      border-radius: 16px;
      background: #f7f8f5;
      color: var(--muted);
      gap: 8px;
    }

    .image-preview img {
      width: 100%;
      height: 240px;
      object-fit: cover;
    }

    .image-preview span {
      font-size: 0.88rem;
      font-weight: 600;
    }

    .price-input {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 0 14px;
    }

    .price-input:focus-within {
      border-color: var(--ink);
    }

    .price-input input {
      border: 0;
      box-shadow: none;
      padding-left: 0;
    }

    .price-input input:focus {
      box-shadow: none;
    }

    .summary {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-radius: 14px;
      background: #f6f7f3;
      padding: 16px;
    }

    .summary div {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      font-size: 0.88rem;
    }

    .summary span {
      color: var(--muted);
    }

    .summary strong {
      text-align: right;
    }

    .footer-error {
      margin: 16px 0 0;
    }

    @media (max-width: 560px) {
      .category-picker {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `,
})
export class RentModal {
  readonly ui = inject(UiService);
  private readonly listings = inject(ListingService);
  private readonly toast = inject(ToastService);

  readonly categories = CATEGORIES;
  readonly countries = COUNTRIES;
  readonly steps = ['Category', 'Location', 'Basics', 'Photo', 'Description', 'Price'];

  readonly step = signal(0);
  readonly busy = signal(false);
  readonly error = signal('');

  readonly categoryValue = signal('');
  readonly locationValue = signal('');
  readonly guestCount = signal(1);
  readonly roomCount = signal(1);
  readonly bathroomCount = signal(1);
  readonly imageSrc = signal('');
  readonly title = signal('');
  readonly description = signal('');
  readonly price = signal(85);
  readonly previewFailed = signal(false);

  readonly center = computed(() => getCountry(this.locationValue())?.latlng);
  readonly locationLabel = computed(() => getCountry(this.locationValue())?.label ?? 'Not selected');

  advance(): void {
    const error = this.validate(this.step());
    if (error) {
      this.error.set(error);
      return;
    }

    this.error.set('');

    if (this.step() < 5) {
      this.step.update((value) => value + 1);
      return;
    }

    void this.createListing();
  }

  back(): void {
    this.error.set('');
    if (this.step() > 0) {
      this.step.update((value) => value - 1);
    }
  }

  close(): void {
    this.error.set('');
    this.step.set(0);
    this.busy.set(false);
    this.ui.closeRent();
  }

  private validate(step: number): string {
    switch (step) {
      case 0:
        return this.categoryValue() ? '' : 'Choose a category for your place.';
      case 1:
        return this.locationValue() ? '' : 'Choose a country.';
      case 3:
        if (!this.imageSrc().trim()) {
          return 'Add an image URL.';
        }
        return /^https?:\/\//i.test(this.imageSrc().trim()) ? '' : 'Enter a valid image URL.';
      case 4:
        if (!this.title().trim()) {
          return 'Add a title.';
        }
        return this.description().trim() ? '' : 'Add a description.';
      case 5:
        return this.price() >= 1 ? '' : 'Set a price of at least $1.';
      default:
        return '';
    }
  }

  private async createListing(): Promise<void> {
    this.busy.set(true);

    try {
      await this.listings.createListing({
        category: this.categoryValue(),
        locationValue: this.locationValue(),
        guestCount: this.guestCount(),
        roomCount: this.roomCount(),
        bathroomCount: this.bathroomCount(),
        imageSrc: this.imageSrc().trim(),
        title: this.title().trim(),
        description: this.description().trim(),
        price: Number(this.price()),
      });

      this.toast.success('Listing created');
      this.close();
      this.reset();
    } catch (error) {
      this.error.set(errorMessage(error, 'Could not create the listing.'));
    } finally {
      this.busy.set(false);
    }
  }

  private reset(): void {
    this.step.set(0);
    this.categoryValue.set('');
    this.locationValue.set('');
    this.guestCount.set(1);
    this.roomCount.set(1);
    this.bathroomCount.set(1);
    this.imageSrc.set('');
    this.title.set('');
    this.description.set('');
    this.price.set(85);
  }
}
