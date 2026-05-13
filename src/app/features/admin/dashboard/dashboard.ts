import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardStats, TrackingService } from '../../../core/services/tracking.service';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';

@Component({
  selector: 'app-dashboard',
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
  isLoading = true;

  constructor(private trackingService: TrackingService) {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.trackingService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: () => {
        console.error('Failed to load dashboard stats.');
      },
    });

    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.recentParcels = parcels.slice(0, 5);
        this.isLoading = false;
      },
      error: () => {
        console.error('Failed to load recent parcels.');
        this.isLoading = false;
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
