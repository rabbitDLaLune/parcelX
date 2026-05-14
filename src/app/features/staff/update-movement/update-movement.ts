import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';

@Component({
  selector: 'app-update-movement',
  imports: [FormsModule],
  templateUrl: './update-movement.html',
})
export class UpdateMovement {
  trackingNumber = 'PXL202605120001';
  parcel: Parcel | null = null;

  status: ParcelStatus = 'ARRIVED_SORTING_HUB';
  locationName = 'Penang Sorting Hub';
  branchId = 1;
  remarks = 'Parcel movement has been updated by staff.';

  successMessage = '';
  errorMessage = '';
  isSearching = false;
  isSubmitting = false;

  statuses: { value: ParcelStatus; label: string }[] = [
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'ARRIVED_ORIGIN_HUB', label: 'Arrived at Origin Hub' },
    { value: 'DEPARTED_ORIGIN_HUB', label: 'Departed Origin Hub' },
    { value: 'ARRIVED_SORTING_HUB', label: 'Arrived at Sorting Hub' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'ARRIVED_DESTINATION_HUB', label: 'Arrived at Destination Hub' },
    { value: 'RETURNED_TO_HUB', label: 'Returned to Hub' },
  ];

  constructor(private trackingService: TrackingService) {}

  searchParcel(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.parcel = null;

    if (!this.trackingNumber.trim()) {
      this.errorMessage = 'Please enter a tracking number.';
      return;
    }

    this.isSearching = true;

    this.trackingService.trackParcel(this.trackingNumber).subscribe({
      next: (parcel) => {
        this.parcel = parcel;
        this.isSearching = false;
      },
      error: () => {
        this.errorMessage = 'Parcel not found.';
        this.isSearching = false;
      },
    });
  }

  updateMovement(): void {
    if (!this.parcel) {
      this.errorMessage = 'Search and select a parcel first.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const payload = {
      status: this.status,
      title: this.getStatusLabel(this.status),
      locationName: this.locationName,
      branchId: Number(this.branchId),
      remarks: this.remarks,
      updatedBy: 'Staff',
    };

    this.trackingService.updateParcelStatus(this.parcel.parcelId, payload).subscribe({
      next: (parcel) => {
        this.parcel = parcel;
        this.successMessage = 'Parcel movement updated successfully.';
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Failed to update parcel movement.';
        this.isSubmitting = false;
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
