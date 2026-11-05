import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthResponse, User } from './models';

const TOKEN_KEY = 'airbnb.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userState = signal<User | null>(null);
  private readonly readyPromise: Promise<void>;

  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => this.userState() !== null);

  constructor() {
    const token = this.getToken();
    this.readyPromise = token ? this.loadCurrentUser() : Promise.resolve();
  }

  get token(): string | null {
    return this.getToken();
  }

  async ensureLoaded(): Promise<void> {
    await this.readyPromise;
  }

  async login(email: string, password: string): Promise<User> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>('/api/auth/login', { email, password }),
    );

    return this.storeSession(response);
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>('/api/auth/register', { name, email, password }),
    );

    return this.storeSession(response);
  }

  updateUser(user: User): void {
    this.userState.set(user);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userState.set(null);
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      const user = await firstValueFrom(this.http.get<User>('/api/auth/me'));
      this.userState.set(user);
    } catch {
      this.logout();
    }
  }

  private storeSession(response: AuthResponse): User {
    localStorage.setItem(TOKEN_KEY, response.token);
    this.userState.set(response.user);
    return response.user;
  }

  private getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }
}
