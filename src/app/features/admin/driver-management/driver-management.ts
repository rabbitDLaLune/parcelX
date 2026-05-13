import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Driver } from '../../../core/models/driver.model';
import { LogisticsService } from '../../../core/services/logistics.service';

@Component({
  selector: 'app-driver-management',
  imports: [RouterLink],
  templateUrl: './driver-management.html',
})
export class DriverManagement {
  drivers: Driver[] = [];

  constructor(private logisticsService: LogisticsService) {
    this.drivers = this.logisticsService.getDrivers();
  }

  getStatusStyle(status: Driver['availabilityStatus']): string {
    return this.logisticsService.getDriverStatusStyle(status);
  }
}
