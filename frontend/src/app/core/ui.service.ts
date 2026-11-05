import { Injectable, signal } from '@angular/core';

export type AuthMode = 'login' | 'register';

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly authOpen = signal(false);
  readonly authMode = signal<AuthMode>('login');
  readonly searchOpen = signal(false);
  readonly rentOpen = signal(false);

  openAuth(mode: AuthMode = 'login'): void {
    this.authMode.set(mode);
    this.authOpen.set(true);
  }

  closeAuth(): void {
    this.authOpen.set(false);
  }

  openSearch(): void {
    this.searchOpen.set(true);
  }

  closeSearch(): void {
    this.searchOpen.set(false);
  }

  openRent(): void {
    this.rentOpen.set(true);
  }

  closeRent(): void {
    this.rentOpen.set(false);
  }
}
