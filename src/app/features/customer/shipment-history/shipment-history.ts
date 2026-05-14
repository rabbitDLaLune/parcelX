import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';

@Component({
  selector: 'app-shipment-history',
  imports: [RouterLink],
  templateUrl: './shipment-history.html',
})
export class ShipmentHistory {
  parcels: Parcel[] = [];

  constructor(private trackingService: TrackingService) {
    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.parcels = parcels;
      },
    });
  }

  getStatusLabel(status: ParcelStatus): string {
    return this.trackingService.getStatusLabel(status);
  }

  getStatusStyle(status: ParcelStatus): string {
    return this.trackingService.getStatusStyle(status);
  }
}
