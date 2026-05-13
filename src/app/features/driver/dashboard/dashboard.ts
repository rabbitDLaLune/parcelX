import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';
import { MapView } from '../../../shared/components/map-view/map-view';

@Component({
  selector: 'app-driver-dashboard',
  imports: [RouterLink, MapView],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  assignedParcels: Parcel[] = [];

  constructor(private trackingService: TrackingService) {
    this.loadAssignedParcels();
  }

  loadAssignedParcels(): void {
    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.assignedParcels = parcels.filter((parcel) => parcel.assignedDriver);
      },
      error: () => {
        console.error('Failed to load assigned parcels.');
      },
    });
  }

  get pendingCount(): number {
    return this.assignedParcels.filter((parcel) => parcel.currentStatus !== 'DELIVERED').length;
  }

  get completedCount(): number {
    return this.assignedParcels.filter((parcel) => parcel.currentStatus === 'DELIVERED').length;
  }

  getStatusLabel(status: ParcelStatus): string {
    return this.trackingService.getStatusLabel(status);
  }

  getStatusStyle(status: ParcelStatus): string {
    return this.trackingService.getStatusStyle(status);
  }
}
