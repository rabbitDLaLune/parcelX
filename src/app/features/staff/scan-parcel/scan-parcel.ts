import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';

@Component({
  selector: 'app-scan-parcel',
  imports: [FormsModule, RouterLink],
  templateUrl: './scan-parcel.html',
})
export class ScanParcel {
  trackingNumber = 'PXL202605120001';
  parcel: Parcel | null = null;
  errorMessage = '';
  isLoading = false;

  constructor(private trackingService: TrackingService) {}

  searchParcel(): void {
    this.errorMessage = '';
    this.parcel = null;

    if (!this.trackingNumber.trim()) {
      this.errorMessage = 'Please enter or scan a tracking number.';
      return;
    }

    this.isLoading = true;

    this.trackingService.trackParcel(this.trackingNumber).subscribe({
      next: (parcel) => {
        this.parcel = parcel;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Parcel not found.';
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
