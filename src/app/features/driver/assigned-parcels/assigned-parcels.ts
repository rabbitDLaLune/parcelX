import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';

@Component({
  selector: 'app-assigned-parcels',
  imports: [RouterLink],
  templateUrl: './assigned-parcels.html',
})
export class AssignedParcels {
  parcels: Parcel[] = [];

  constructor(private trackingService: TrackingService) {
    this.loadParcels();
  }

  loadParcels(): void {
    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.parcels = parcels.filter((parcel) => parcel.assignedDriver);
      },
      error: () => {
        console.error('Failed to load assigned parcels.');
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
