import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';

@Component({
  selector: 'app-parcel-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './parcel-list.html',
})
export class ParcelList {
  parcels: Parcel[] = [];
  searchTerm = '';
  statusFilter = 'ALL';
  isLoading = true;
  errorMessage = '';

  statuses: { value: ParcelStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Status' },
    { value: 'CREATED', label: 'Created' },
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'DELIVERY_FAILED', label: 'Delivery Failed' },
  ];

  constructor(private trackingService: TrackingService) {
    this.loadParcels();
  }

  loadParcels(): void {
    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.parcels = parcels;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load parcels from API.';
        this.isLoading = false;
      },
    });
  }

  get filteredParcels(): Parcel[] {
    return this.parcels.filter((parcel) => {
      const search = this.searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        parcel.trackingNumber.toLowerCase().includes(search) ||
        parcel.senderName.toLowerCase().includes(search) ||
        parcel.receiverName.toLowerCase().includes(search) ||
        parcel.latestLocation.toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'ALL' || parcel.currentStatus === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusLabel(status: ParcelStatus): string {
    return this.trackingService.getStatusLabel(status);
  }

  getStatusStyle(status: ParcelStatus): string {
    return this.trackingService.getStatusStyle(status);
  }
}
