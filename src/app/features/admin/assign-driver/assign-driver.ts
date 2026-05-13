import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Parcel } from '../../../core/models/parcel.model';
import { Driver } from '../../../core/models/driver.model';
import { TrackingService } from '../../../core/services/tracking.service';
import { LogisticsService } from '../../../core/services/logistics.service';

@Component({
  selector: 'app-assign-driver',
  imports: [FormsModule],
  templateUrl: './assign-driver.html',
})
export class AssignDriver {
  parcels: Parcel[] = [];
  drivers: Driver[] = [];

  selectedParcelId = '';
  selectedDriverId = '';
  successMessage = '';

  constructor(
    private trackingService: TrackingService,
    private logisticsService: LogisticsService,
  ) {
    this.loadData();
  }

  loadData(): void {
    this.trackingService.getAllParcels().subscribe({
      next: (parcels) => {
        this.parcels = parcels;
      },
      error: () => {
        this.successMessage = 'Failed to load parcels from API.';
      },
    });

    this.drivers = this.logisticsService.getAvailableDrivers();
  }

  assignDriver(): void {
    if (!this.selectedParcelId || !this.selectedDriverId) {
      this.successMessage = 'Please select both parcel and driver.';
      return;
    }

    const parcel = this.parcels.find((item) => item.parcelId === Number(this.selectedParcelId));

    const driver = this.drivers.find((item) => item.driverId === Number(this.selectedDriverId));

    if (!parcel || !driver) {
      this.successMessage = 'Invalid parcel or driver selected.';
      return;
    }

    this.successMessage = `${parcel.trackingNumber} has been assigned to ${driver.fullName}. Backend update will be connected later.`;
  }
}
