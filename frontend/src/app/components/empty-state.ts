import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <section class="empty-state">
      <span class="empty-mark">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
          <path d="M9 21v-6h6v6" />
        </svg>
      </span>
      <h2>{{ title() }}</h2>
      <p>{{ subtitle() }}</p>
      @if (showReset()) {
        <button type="button" class="btn btn-outline empty-button" (click)="reset.emit()">
          Remove all filters
        </button>
      }
    </section>
  `,
  styles: `
    .empty-state {
      display: flex;
      min-height: 58vh;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
    }

    .empty-mark {
      display: grid;
      width: 70px;
      height: 70px;
      margin-bottom: 20px;
      place-items: center;
      border-radius: 22px;
      background: #eef4ef;
      color: #476458;
    }

    .empty-mark svg {
      width: 34px;
      height: 34px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 1.55rem;
    }

    p {
      max-width: 430px;
      margin: 0;
      color: var(--muted);
    }

    .empty-button {
      width: 210px;
      margin-top: 24px;
    }
  `,
})
export class EmptyState {
  readonly title = input('No exact matches');
  readonly subtitle = input('Try changing or removing some of your filters.');
  readonly showReset = input(false);
  readonly reset = output<void>();
}
