import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';
import { AppIcon } from './icon';

@Component({
  selector: 'app-toasts',
  imports: [AppIcon],
  template: `
    <div class="toast-stack" aria-live="polite">
      @for (toast of toasts.toasts(); track toast.id) {
        <button
          type="button"
          class="toast"
          [class.toast-error]="toast.kind === 'error'"
          (click)="toasts.dismiss(toast.id)"
        >
          <span class="toast-icon">
            <app-icon [name]="toast.kind === 'error' ? 'alert' : 'check'" [size]="18" />
          </span>
          <span>{{ toast.message }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    .toast-stack {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 200;
      display: flex;
      width: min(380px, calc(100vw - 32px));
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid rgba(35, 58, 46, 0.12);
      border-radius: 14px;
      background: #fff;
      padding: 13px 16px;
      color: var(--ink);
      font: inherit;
      font-size: 0.92rem;
      font-weight: 600;
      text-align: left;
      box-shadow: 0 16px 45px rgba(27, 40, 34, 0.18);
      pointer-events: auto;
      animation: toast-in 180ms ease-out;
    }

    .toast-icon {
      display: grid;
      width: 30px;
      height: 30px;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 50%;
      background: #e7f5ee;
      color: #26704e;
    }

    .toast-error .toast-icon {
      background: #fdecec;
      color: #b3261e;
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
    }
  `,
})
export class Toasts {
  readonly toasts = inject(ToastService);
}
