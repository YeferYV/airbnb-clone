import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  host: {
    class: 'app-icon',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('menu') {
          <path d="M4 7h16M4 12h16M4 17h16" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        }
        @case ('globe') {
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z" />
        }
        @case ('heart') {
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        }
        @case ('chevron-left') {
          <path d="m15 18-6-6 6-6" />
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6" />
        }
        @case ('x') {
          <path d="M18 6 6 18M6 6l12 12" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('minus') {
          <path d="M5 12h14" />
        }
        @case ('home') {
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
          <path d="M9 21v-6h6v6" />
        }
        @case ('logout') {
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5M21 12H9" />
        }
        @case ('calendar') {
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        }
        @case ('users') {
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
        }
        @case ('image') {
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        }
        @case ('map-pin') {
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        }
        @case ('star') {
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1Z" />
        }
        @case ('check') {
          <path d="m5 12 4.5 4.5L19 7" />
        }
        @case ('alert') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6M12 17h.01" />
        }
        @case ('beach') {
          <path d="M3 11a9 9 0 0 1 18 0Z" />
          <path d="M12 11v9M8 21h8" />
        }
        @case ('windmill') {
          <path d="m12 12-4-8m4 8 8-4m-8 4-4 8m4-8v9" />
        }
        @case ('mountain') {
          <path d="m3 20 6-12 4 8 2-4 6 8Z" />
        }
        @case ('waves') {
          <path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
          <path d="M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
          <path d="M2 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        }
        @case ('island') {
          <path d="M3 20h18M12 20V9" />
          <path d="M12 9C10 6 7 5 4 7c3-1 5 0 8 2Z" />
          <path d="M12 9c2-3 5-4 8-2-3-1-5 0-8 2Z" />
        }
        @case ('boat') {
          <path d="M3 16h18l-3 4H6Z" />
          <path d="M6 16V9h5v7M12 5v11" />
        }
        @case ('ski') {
          <path d="m4 20 16-16M14 5l5 5M4 14l4 4" />
        }
        @case ('castle') {
          <path d="M4 21V8h4V4h3v4h2V4h3v4h4v13Z" />
          <path d="M10 21v-5h4v5" />
        }
        @case ('cave') {
          <path d="M3 21V8a9 9 0 0 1 18 0v13" />
          <path d="M8 21v-6a4 4 0 0 1 8 0v6" />
        }
        @case ('tent') {
          <path d="M3 21 12 4l9 17Z" />
          <path d="m12 10-4 11m4-11 4 11" />
        }
        @case ('snow') {
          <path d="M12 2v20M4 6l16 12M20 6 4 18" />
        }
        @case ('cactus') {
          <path d="M9 21V7a3 3 0 0 1 6 0v14" />
          <path d="M9 13H5a2 2 0 0 1-2-2V9M15 16h4a2 2 0 0 0 2-2v-2M3 21h18" />
        }
        @case ('barn') {
          <path d="M3 21V9l9-6 9 6v12ZM3 21h18" />
          <path d="M9 21v-6h6v6" />
        }
        @case ('diamond') {
          <path d="m12 3 8 6-8 12L4 9Z" />
          <path d="M4 9h16M9 9l3-6 3 6" />
        }
        @default {
          <circle cx="12" cy="12" r="9" />
        }
      }
    </svg>
  `,
  styles: `
    .app-icon {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }
  `,
})
export class AppIcon {
  readonly name = input('globe');
  readonly size = input(24);
}
