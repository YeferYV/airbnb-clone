import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private sequence = 0;
  readonly toasts = signal<Toast[]>([]);

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(id: number): void {
    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }

  private show(message: string, kind: ToastKind): void {
    const id = ++this.sequence;
    this.toasts.update((items) => [...items, { id, message, kind }]);
    window.setTimeout(() => this.dismiss(id), 4200);
  }
}
