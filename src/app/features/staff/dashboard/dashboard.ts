import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardStats, TrackingService } from '../../../core/services/tracking.service';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';

@Component({
  selector: 'app-staff-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  stats: DashboardStats = {
    totalParcels: 0,
    inTransit: 0,
    outForDelivery: 0,
    delivered: 0,
    failed: 0,
    totalRevenue: 0,
    activeDrivers: 0,
  };

  recentParcels: Parcel[] = [];

  constructor(private trackingService: TrackingService) {
    this.loadData();
  }

  loadData(): void {
    this.trackingService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
    });

    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.recentParcels = parcels.slice(0, 5);
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
