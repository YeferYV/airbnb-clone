import { Component, input, output } from '@angular/core';
import { AppIcon } from './icon';

@Component({
  selector: 'app-counter',
  imports: [AppIcon],
  template: `
    <div class="counter-row">
      <div class="counter-copy">
        <strong>{{ title() }}</strong>
        <span>{{ subtitle() }}</span>
      </div>
      <div class="counter-actions">
        <button
          type="button"
          class="round-button"
          [disabled]="value() <= min()"
          (click)="change(-1)"
          [attr.aria-label]="'Decrease ' + title()"
        >
          <app-icon name="minus" [size]="16" />
        </button>
        <span class="counter-value">{{ value() }}</span>
        <button
          type="button"
          class="round-button"
          (click)="change(1)"
          [attr.aria-label]="'Increase ' + title()"
        >
          <app-icon name="plus" [size]="16" />
        </button>
      </div>
    </div>
  `,
  styles: `
    .counter-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 0;
      border-bottom: 1px solid var(--line);
    }

    .counter-row:last-child {
      border-bottom: 0;
    }

    .counter-copy {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .counter-copy strong {
      font-size: 0.97rem;
    }

    .counter-copy span {
      color: var(--muted);
      font-size: 0.86rem;
    }

    .counter-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .counter-value {
      min-width: 24px;
      text-align: center;
      font-size: 1rem;
    }
  `,
})
export class Counter {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly value = input.required<number>();
  readonly min = input(1);
  readonly valueChange = output<number>();

  change(delta: number): void {
    const next = this.value() + delta;
    if (next >= this.min()) {
      this.valueChange.emit(next);
    }
  }
}
