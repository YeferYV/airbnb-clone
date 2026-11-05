import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-map',
  template: `
    <div class="map-frame">
      <iframe
        title="Property location"
        [src]="mapUrl()"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  `,
  styles: `
    .map-frame {
      position: relative;
      height: 300px;
      overflow: hidden;
      border-radius: 16px;
      border: 1px solid var(--line);
      background: #eef1ec;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }

    @media (max-width: 640px) {
      .map-frame {
        height: 240px;
      }
    }
  `,
})
export class MapView {
  private readonly sanitizer = inject(DomSanitizer);

  readonly center = input<[number, number] | number[] | undefined | null>(null);

  readonly mapUrl = computed(() => {
    const point = this.center();
    let bbox = '-180,-60,180,80';
    let marker = '';

    if (point && point.length >= 2) {
      const lat = Number(point[0]);
      const lng = Number(point[1]);
      bbox = `${lng - 6},${lat - 4},${lng + 6},${lat + 4}`;
      marker = `&marker=${lat},${lng}`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`,
    );
  });
}
