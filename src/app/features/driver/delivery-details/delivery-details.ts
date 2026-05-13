import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';
import { MapView } from '../../../shared/components/map-view/map-view';
import { QrCode } from '../../../shared/components/qr-code/qr-code';

@Component({
  selector: 'app-delivery-details',
  imports: [RouterLink, MapView, QrCode],
  templateUrl: './delivery-details.html',
})
export class DeliveryDetails {
  parcel: Parcel | null = null;
  successMessage = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService,
  ) {
    this.loadParcel();
  }

  loadParcel(): void {
    const parcelId = Number(this.route.snapshot.paramMap.get('id'));

    this.trackingService.getParcelById(parcelId).subscribe({
      next: (parcel) => {
        this.parcel = parcel;
        this.isLoading = false;
      },
      error: () => {
        this.parcel = null;
        this.isLoading = false;
      },
    });
  }

  markDelivered(): void {
    if (!this.parcel) return;

    this.successMessage = '';

    this.trackingService
      .markDelivered(this.parcel.parcelId, {
        receiverName: this.parcel.receiverName,
        deliveryNote: 'Parcel delivered successfully.',
      })
      .subscribe({
        next: (parcel) => {
          this.parcel = parcel;
          this.successMessage = 'Parcel marked as delivered successfully.';
        },
        error: () => {
          this.successMessage = 'Failed to mark parcel as delivered.';
        },
      });
  }

  markFailed(): void {
    if (!this.parcel) return;

    this.successMessage = '';

    this.trackingService
      .markFailed(this.parcel.parcelId, {
        reason: 'Customer not available.',
      })
      .subscribe({
        next: (parcel) => {
          this.parcel = parcel;
          this.successMessage = 'Parcel marked as failed successfully.';
        },
        error: () => {
          this.successMessage = 'Failed to mark parcel as failed.';
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
