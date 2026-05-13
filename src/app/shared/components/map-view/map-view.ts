import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  imports: [],
  templateUrl: './map-view.html',
})
export class MapView implements AfterViewInit, OnChanges {
  @Input() latitude = 5.4141;
  @Input() longitude = 100.3288;
  @Input() label = 'Parcel Location';

  private map?: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;

    if (changes['latitude'] || changes['longitude'] || changes['label']) {
      this.updateMarker();
    }
  }

  private initMap(): void {
    this.map = L.map('parcel-map', {
      center: [this.latitude, this.longitude],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.updateMarker();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  }

  private updateMarker(): void {
    if (!this.map) return;

    const position: L.LatLngExpression = [this.latitude, this.longitude];

    if (this.marker) {
      this.marker.setLatLng(position);
      this.marker.bindPopup(this.label);
    } else {
      this.marker = L.marker(position).addTo(this.map);
      this.marker.bindPopup(this.label);
    }

    this.map.setView(position, 13);
  }
}
