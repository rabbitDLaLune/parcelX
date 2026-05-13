import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TrackingService } from '../../../core/services/tracking.service';

@Component({
  selector: 'app-parcel-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './parcel-form.html',
})
export class ParcelForm {
  senderName = '';
  senderPhone = '';
  senderAddress = '';

  receiverName = '';
  receiverPhone = '';
  receiverAddress = '';

  originBranchId = 1;
  destinationBranchId = 2;

  deliveryType = 'Standard Delivery';
  parcelWeight = 1;
  parcelSize = 'Small';
  parcelCategory = 'Document';

  baseFee = 5;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private trackingService: TrackingService,
    private router: Router,
  ) {}

  get estimatedFee(): number {
    const weightCharge = this.parcelWeight * 2;

    if (this.deliveryType === 'Express Delivery') {
      return this.baseFee + weightCharge + 4;
    }

    if (this.deliveryType === 'Same-Day Delivery') {
      return this.baseFee + weightCharge + 8;
    }

    return this.baseFee + weightCharge;
  }

  registerParcel(): void {
    this.errorMessage = '';

    if (
      !this.senderName ||
      !this.senderPhone ||
      !this.senderAddress ||
      !this.receiverName ||
      !this.receiverPhone ||
      !this.receiverAddress
    ) {
      this.errorMessage = 'Please fill in all sender and receiver details.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      senderName: this.senderName,
      senderPhone: this.senderPhone,
      senderAddress: this.senderAddress,
      receiverName: this.receiverName,
      receiverPhone: this.receiverPhone,
      receiverAddress: this.receiverAddress,
      originBranchId: this.originBranchId,
      destinationBranchId: this.destinationBranchId,
      currentBranchId: this.originBranchId,
      parcelWeight: Number(this.parcelWeight),
      parcelSize: this.parcelSize,
      parcelCategory: this.parcelCategory,
      deliveryType: this.deliveryType,
      deliveryFee: this.estimatedFee,
      estimatedDeliveryDate: '2026-05-16',
    };

    this.trackingService.createParcel(payload).subscribe({
      next: (parcel) => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/parcels', parcel.parcelId]);
      },
      error: () => {
        this.errorMessage = 'Failed to register parcel.';
        this.isSubmitting = false;
      },
    });
  }
}
