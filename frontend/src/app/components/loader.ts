import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-wrap" role="status" aria-label="Loading">
      <span class="loader-ring"></span>
    </div>
  `,
  styles: `
    .loader-wrap {
      display: grid;
      min-height: 52vh;
      place-items: center;
    }

    .loader-ring {
      width: 54px;
      height: 54px;
      border: 4px solid #e9eeea;
      border-top-color: var(--rose);
      border-radius: 50%;
      animation: spin 700ms linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class Loader {}
