import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Parcel, ParcelStatus } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';
import { QrCode } from '../../../shared/components/qr-code/qr-code';
import { MapView } from '../../../shared/components/map-view/map-view';

@Component({
  selector: 'app-parcel-details',
  imports: [RouterLink, QrCode, MapView],
  templateUrl: './parcel-details.html',
})
export class ParcelDetails {
  parcel: Parcel | null = null;
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

  getStatusLabel(status: ParcelStatus): string {
    return this.trackingService.getStatusLabel(status);
  }

  getStatusStyle(status: ParcelStatus): string {
    return this.trackingService.getStatusStyle(status);
  }
}
