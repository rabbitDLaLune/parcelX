import { Injectable } from '@angular/core';
import { Branch } from '../models/branch.model';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root',
})
export class LogisticsService {
  private branches: Branch[] = [
    {
      branchId: 1,
      branchCode: 'PNG-HUB-01',
      branchName: 'Penang Sorting Hub',
      address: 'Bayan Lepas Industrial Area',
      city: 'Bayan Lepas',
      state: 'Penang',
      postcode: '11900',
      phone: '04-600 1122',
      latitude: 5.2948,
      longitude: 100.2592,
      status: 'Active',
      createdAt: '01 May 2026',
    },
    {
      branchId: 2,
      branchCode: 'PNG-BR-02',
      branchName: 'Georgetown Branch',
      address: 'Jalan Transfer, Georgetown',
      city: 'Georgetown',
      state: 'Penang',
      postcode: '10050',
      phone: '04-222 8899',
      latitude: 5.4141,
      longitude: 100.3288,
      status: 'Active',
      createdAt: '02 May 2026',
    },
    {
      branchId: 3,
      branchCode: 'KL-HUB-01',
      branchName: 'Kuala Lumpur Main Hub',
      address: 'Taman Perindustrian KL',
      city: 'Kuala Lumpur',
      state: 'Kuala Lumpur',
      postcode: '50400',
      phone: '03-8899 2200',
      latitude: 3.139,
      longitude: 101.6869,
      status: 'Active',
      createdAt: '03 May 2026',
    },
    {
      branchId: 4,
      branchCode: 'JHR-HUB-01',
      branchName: 'Johor Bahru Hub',
      address: 'Tebrau Industrial Park',
      city: 'Johor Bahru',
      state: 'Johor',
      postcode: '81100',
      phone: '07-330 7788',
      latitude: 1.4927,
      longitude: 103.7414,
      status: 'Active',
      createdAt: '04 May 2026',
    },
  ];

  private drivers: Driver[] = [
    {
      driverId: 1,
      userId: 201,
      fullName: 'Daniel Tan',
      email: 'daniel.driver@parcelx.test',
      phone: '012-456 7890',
      branchId: 2,
      branchName: 'Georgetown Branch',
      vehicleType: 'Motorcycle',
      vehicleNumber: 'PNA 2381',
      licenseNumber: 'D1234567',
      availabilityStatus: 'On Delivery',
      assignedParcelCount: 8,
      completedToday: 5,
      failedToday: 0,
      createdAt: '05 May 2026',
    },
    {
      driverId: 2,
      userId: 202,
      fullName: 'Ravi Kumar',
      email: 'ravi.driver@parcelx.test',
      phone: '013-888 1212',
      branchId: 4,
      branchName: 'Johor Bahru Hub',
      vehicleType: 'Van',
      vehicleNumber: 'JQB 9001',
      licenseNumber: 'D7654321',
      availabilityStatus: 'Available',
      assignedParcelCount: 3,
      completedToday: 7,
      failedToday: 1,
      createdAt: '05 May 2026',
    },
    {
      driverId: 3,
      userId: 203,
      fullName: 'Aiman Hakimi',
      email: 'aiman.driver@parcelx.test',
      phone: '017-222 4455',
      branchId: 1,
      branchName: 'Penang Sorting Hub',
      vehicleType: 'Motorcycle',
      vehicleNumber: 'PJK 6612',
      licenseNumber: 'D9988776',
      availabilityStatus: 'Available',
      assignedParcelCount: 5,
      completedToday: 4,
      failedToday: 0,
      createdAt: '06 May 2026',
    },
    {
      driverId: 4,
      userId: 204,
      fullName: 'Nur Farah',
      email: 'farah.driver@parcelx.test',
      phone: '018-333 9011',
      branchId: 3,
      branchName: 'Kuala Lumpur Main Hub',
      vehicleType: 'Van',
      vehicleNumber: 'VBN 4410',
      licenseNumber: 'D1122334',
      availabilityStatus: 'Offline',
      assignedParcelCount: 0,
      completedToday: 2,
      failedToday: 0,
      createdAt: '07 May 2026',
    },
  ];

  getBranches(): Branch[] {
    return this.branches;
  }

  getDrivers(): Driver[] {
    return this.drivers;
  }

  getAvailableDrivers(): Driver[] {
    return this.drivers.filter(
      (driver) =>
        driver.availabilityStatus === 'Available' || driver.availabilityStatus === 'On Delivery',
    );
  }

  getDriverById(driverId: number): Driver | null {
    return this.drivers.find((driver) => driver.driverId === driverId) ?? null;
  }

  getDriverStatusStyle(status: Driver['availabilityStatus']): string {
    if (status === 'Available') {
      return 'bg-emerald-100 text-emerald-700';
    }

    if (status === 'On Delivery') {
      return 'bg-orange-100 text-orange-700';
    }

    if (status === 'Offline') {
      return 'bg-slate-100 text-slate-700';
    }

    return 'bg-red-100 text-red-700';
  }

  getBranchStatusStyle(status: Branch['status']): string {
    if (status === 'Active') {
      return 'bg-emerald-100 text-emerald-700';
    }

    return 'bg-red-100 text-red-700';
  }
}
