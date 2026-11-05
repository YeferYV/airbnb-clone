import { Component, HostListener, effect, input, output } from '@angular/core';
import { AppIcon } from './icon';

@Component({
  selector: 'app-modal',
  imports: [AppIcon],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="onBackdrop($event)">
        <div class="modal-panel" [class.modal-wide]="wide()" role="dialog" aria-modal="true">
          <div class="modal-head">
            <button type="button" class="icon-button modal-close" (click)="closed.emit()" aria-label="Close">
              <app-icon name="x" [size]="18" />
            </button>
            <h2>{{ title() }}</h2>
          </div>

          <div class="modal-body">
            <ng-content />
          </div>

          <div class="modal-foot">
            <div class="modal-actions">
              @if (secondaryLabel()) {
                <button type="button" class="btn btn-outline" [disabled]="disabled()" (click)="secondary.emit()">
                  {{ secondaryLabel() }}
                </button>
              }
              <button type="button" class="btn btn-primary" [disabled]="disabled()" (click)="action.emit()">
                {{ disabled() ? 'Please wait...' : actionLabel() }}
              </button>
            </div>
            <ng-content select="[modal-footer]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      overflow-y: auto;
      background: rgba(24, 26, 25, 0.66);
      backdrop-filter: blur(3px);
      animation: fade-in 160ms ease-out;
    }

    .modal-panel {
      display: flex;
      width: min(100%, 600px);
      max-height: calc(100vh - 48px);
      flex-direction: column;
      overflow: hidden;
      border-radius: 22px;
      background: #fff;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.24);
      animation: rise-in 220ms ease-out;
    }

    .modal-wide {
      width: min(100%, 760px);
    }

    .modal-head {
      position: relative;
      display: flex;
      min-height: 64px;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--line);
      padding: 16px 56px;
    }

    .modal-head h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      text-align: center;
    }

    .modal-close {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
    }

    .modal-body {
      overflow-y: auto;
      padding: 24px;
    }

    .modal-foot {
      border-top: 1px solid var(--line);
      padding: 18px 24px 24px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
    }

    .modal-actions .btn {
      flex: 1;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    @keyframes rise-in {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
    }
  `,
})
export class Modal {
  private previousOverflow = '';

  readonly isOpen = input(false);
  readonly title = input('');
  readonly actionLabel = input('Continue');
  readonly secondaryLabel = input<string | undefined>(undefined);
  readonly disabled = input(false);
  readonly wide = input(false);

  readonly closed = output<void>();
  readonly action = output<void>();
  readonly secondary = output<void>();

  constructor() {
    effect(() => {
      if (typeof document === 'undefined') {
        return;
      }

      if (this.isOpen()) {
        this.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else if (this.previousOverflow !== undefined) {
        document.body.style.overflow = this.previousOverflow;
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.closed.emit();
    }
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
