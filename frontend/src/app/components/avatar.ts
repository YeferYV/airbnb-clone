import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `
    @if (src() && !failed()) {
      <img [src]="src()!" [alt]="name() || 'Avatar'" (error)="failed.set(true)" />
    } @else {
      <span>{{ initials() }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 34px;
      height: 34px;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 50%;
      background: linear-gradient(135deg, #d7e8df, #b8d8c8);
      color: #355146;
      font-size: 0.72rem;
      font-weight: 800;
      align-items: center;
      justify-content: center;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
})
export class Avatar {
  readonly src = input<string | null | undefined>(null);
  readonly name = input('');
  readonly failed = signal(false);

  readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join(''),
  );
}
