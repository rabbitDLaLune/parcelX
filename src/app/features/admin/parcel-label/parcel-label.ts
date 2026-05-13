import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Parcel } from '../../../core/models/parcel.model';
import { TrackingService } from '../../../core/services/tracking.service';
import { QrCode } from '../../../shared/components/qr-code/qr-code';

@Component({
  selector: 'app-parcel-label',
  imports: [RouterLink, QrCode],
  templateUrl: './parcel-label.html',
})
export class ParcelLabel {
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

  printLabel(): void {
    window.print();
  }
}
