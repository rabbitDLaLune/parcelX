import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';

@Component({
  selector: 'app-customer-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  parcels: Parcel[] = [];

  constructor(private trackingService: TrackingService) {
    this.loadShipments();
  }

  loadShipments(): void {
    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.parcels = parcels;
      },
      error: () => {
        console.error('Failed to load customer shipments.');
      },
    });
  }

  get activeShipments(): number {
    return this.parcels.filter(
      (parcel) => parcel.currentStatus !== 'DELIVERED' && parcel.currentStatus !== 'CANCELLED',
    ).length;
  }

  get deliveredShipments(): number {
    return this.parcels.filter((parcel) => parcel.currentStatus === 'DELIVERED').length;
  }

  getStatusLabel(status: ParcelStatus): string {
    return this.trackingService.getStatusLabel(status);
  }

  getStatusStyle(status: ParcelStatus): string {
    return this.trackingService.getStatusStyle(status);
  }
}
