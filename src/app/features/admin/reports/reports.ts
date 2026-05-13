import { Component } from '@angular/core';
import { DashboardStats, TrackingService } from '../../../core/services/tracking.service';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
})
export class Reports {
  parcels: Parcel[] = [];

  stats: DashboardStats = {
    totalParcels: 0,
    inTransit: 0,
    outForDelivery: 0,
    delivered: 0,
    failed: 0,
    totalRevenue: 0,
    activeDrivers: 0,
  };

  constructor(private trackingService: TrackingService) {
    this.loadReports();
  }

  loadReports(): void {
    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.parcels = parcels;
      },
      error: () => {
        console.error('Failed to load report parcels.');
      },
    });

    this.trackingService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: () => {
        console.error('Failed to load report stats.');
      },
    });
  }

  getStatusLabel(status: ParcelStatus): string {
    return this.trackingService.getStatusLabel(status);
  }

  get deliveredRate(): number {
    if (this.stats.totalParcels === 0) return 0;
    return (this.stats.delivered / this.stats.totalParcels) * 100;
  }

  get failedRate(): number {
    if (this.stats.totalParcels === 0) return 0;
    return (this.stats.failed / this.stats.totalParcels) * 100;
  }

  exportReport(): void {
    alert('Report export will be connected later using backend API.');
  }
}
