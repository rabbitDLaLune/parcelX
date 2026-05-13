import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';

@Component({
  selector: 'app-track-parcel',
  imports: [FormsModule],
  templateUrl: './track-parcel.html',
})
export class TrackParcel {
  trackingNumber = 'PXL202605120001';
  parcel: Parcel | null = null;
  hasSearched = false;
  isLoading = false;
  errorMessage = '';

  constructor(private trackingService: TrackingService) {}

  ngOnInit(): void {
    this.searchParcel();
  }

  searchParcel(): void {
    this.hasSearched = true;
    this.errorMessage = '';

    if (!this.trackingNumber.trim()) {
      this.parcel = null;
      this.errorMessage = 'Please enter a tracking number.';
      return;
    }

    this.isLoading = true;

    this.trackingService.trackParcel(this.trackingNumber).subscribe({
      next: (parcel) => {
        this.parcel = parcel;
        this.isLoading = false;
      },
      error: () => {
        this.parcel = null;
        this.errorMessage = 'No parcel found. Please check the tracking number and try again.';
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
