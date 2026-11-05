import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/error';
import { ToastService } from '../core/toast.service';
import { UiService } from '../core/ui.service';
import { AppIcon } from './icon';
import { Modal } from './modal';

@Component({
  selector: 'app-auth-modal',
  imports: [FormsModule, Modal, AppIcon],
  template: `
    <app-modal
      [isOpen]="ui.authOpen()"
      [title]="isLogin() ? 'Log in or sign up' : 'Create your account'"
      [actionLabel]="isLogin() ? 'Continue' : 'Create account'"
      [disabled]="busy()"
      (closed)="close()"
      (action)="submit()"
    >
      <form class="form-stack" (submit)="$event.preventDefault(); submit()">
        <div class="modal-heading">
          <h3>{{ isLogin() ? 'Welcome back' : 'Welcome to Airbnb' }}</h3>
          <p>{{ isLogin() ? 'Log in to your account to continue.' : 'Create an account to start exploring.' }}</p>
        </div>

        @if (!isLogin()) {
          <label class="field">
            <span>Name</span>
            <input
              name="name"
              [(ngModel)]="name"
              autocomplete="name"
              placeholder="Your name"
              required
            />
          </label>
        }

        <label class="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            [(ngModel)]="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <label class="field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            [(ngModel)]="password"
            [autocomplete]="isLogin() ? 'current-password' : 'new-password'"
            placeholder="At least 6 characters"
            minlength="6"
            required
          />
        </label>

        @if (error()) {
          <p class="form-error">{{ error() }}</p>
        }
      </form>

      <div modal-footer class="auth-footer">
        <div class="auth-toggle">
          {{ isLogin() ? 'First time using Airbnb?' : 'Already have an account?' }}
          <button type="button" (click)="toggleMode()">
            {{ isLogin() ? 'Create an account' : 'Log in' }}
          </button>
        </div>

        @if (isLogin()) {
          <button type="button" class="demo-login" [disabled]="busy()" (click)="demoLogin()">
            <app-icon name="star" [size]="16" />
            Use demo account
          </button>
          <p class="demo-note">demo@airbnb.dev / password123</p>
        }
      </div>
    </app-modal>
  `,
  styles: `
    .modal-heading {
      margin-bottom: 6px;
    }

    .modal-heading h3 {
      margin: 0 0 6px;
      font-size: 1.5rem;
    }

    .modal-heading p {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .auth-footer {
      margin-top: 20px;
      border-top: 1px solid var(--line);
      padding-top: 18px;
    }

    .auth-toggle {
      color: var(--muted);
      font-size: 0.9rem;
    }

    .auth-toggle button {
      border: 0;
      background: none;
      padding: 0 0 0 4px;
      color: var(--ink);
      font: inherit;
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
    }

    .demo-login {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 14px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #f7f7f4;
      padding: 9px 13px;
      color: var(--ink);
      font: inherit;
      font-size: 0.86rem;
      font-weight: 700;
      cursor: pointer;
    }

    .demo-login:hover {
      background: #f0f1ed;
    }

    .demo-note {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 0.78rem;
    }
  `,
})
export class AuthModal {
  readonly ui = inject(UiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly isLogin = computed(() => this.ui.authMode() === 'login');
  readonly busy = signal(false);
  readonly error = signal('');

  name = '';
  email = '';
  password = '';

  close(): void {
    this.ui.closeAuth();
    this.error.set('');
    this.password = '';
  }

  toggleMode(): void {
    this.ui.authMode.set(this.isLogin() ? 'register' : 'login');
    this.error.set('');
  }

  demoLogin(): void {
    this.name = 'Demo Guest';
    this.email = 'demo@airbnb.dev';
    this.password = 'password123';
    void this.submit();
  }

  async submit(): Promise<void> {
    if (this.busy()) {
      return;
    }

    if (!this.email.trim() || !this.password) {
      this.error.set('Enter your email and password.');
      return;
    }

    if (!this.isLogin() && !this.name.trim()) {
      this.error.set('Enter your name.');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }

    this.busy.set(true);
    this.error.set('');

    try {
      const user = this.isLogin()
        ? await this.auth.login(this.email.trim(), this.password)
        : await this.auth.register(this.name.trim(), this.email.trim(), this.password);

      this.toast.success(this.isLogin() ? `Welcome back, ${user.name}` : 'Your account is ready');
      this.close();
      this.email = '';
      this.name = '';
    } catch (error) {
      this.error.set(errorMessage(error, 'Could not complete sign in.'));
    } finally {
      this.busy.set(false);
    }
  }
}
