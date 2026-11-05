import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { CATEGORIES } from '../../core/categories';
import { flagUrl, getCountry } from '../../core/countries';
import { UiService } from '../../core/ui.service';
import { Avatar } from '../avatar';
import { AppIcon } from '../icon';

@Component({
  selector: 'app-navbar',
  imports: [Avatar, AppIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ),
    { initialValue: null },
  );

  readonly auth = inject(AuthService);
  readonly ui = inject(UiService);
  readonly categories = CATEGORIES;
  readonly menuOpen = signal(false);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(() => this.menuOpen.set(false));
  }

  readonly currentUrl = computed(() => {
    const event = this.navigationEnd();
    return event?.urlAfterRedirects ?? this.router.url;
  });

  readonly queryParams = computed(
    () => this.router.parseUrl(this.currentUrl()).queryParams,
  );

  readonly isHome = computed(() => this.currentUrl().split('?')[0] === '/');
  readonly selectedCategory = computed(() => this.queryParams()['category'] ?? '');

  readonly searchLocation = computed(() => {
    const value = this.queryParams()['locationValue'];
    return getCountry(value)?.label ?? 'Anywhere';
  });

  readonly searchDates = computed(() => {
    const start = this.queryParams()['startDate'];
    const end = this.queryParams()['endDate'];

    if (!start || !end) {
      return 'Any week';
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000));
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  });

  readonly searchGuests = computed(() => {
    const guests = Number(this.queryParams()['guestCount'] ?? 0);
    return guests > 0 ? `${guests} ${guests === 1 ? 'guest' : 'guests'}` : 'Add guests';
  });

  readonly locationFlag = computed(() => flagUrl(this.queryParams()['locationValue']));

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  selectCategory(label: string): void {
    const nextCategory = this.selectedCategory() === label ? null : label;
    void this.router.navigate(['/'], {
      queryParams: {
        ...this.queryParams(),
        category: nextCategory,
      },
    });
  }

  openSearch(): void {
    this.menuOpen.set(false);
    this.ui.openSearch();
  }

  openRent(): void {
    this.menuOpen.set(false);
    if (this.auth.isAuthenticated()) {
      this.ui.openRent();
      return;
    }

    this.ui.openAuth('login');
  }

  go(path: string): void {
    this.menuOpen.set(false);
    void this.router.navigate([path]);
  }

  logout(): void {
    this.auth.logout();
    this.menuOpen.set(false);
    void this.router.navigate(['/']);
  }

  openAuth(mode: 'login' | 'register'): void {
    this.menuOpen.set(false);
    this.ui.openAuth(mode);
  }
}
