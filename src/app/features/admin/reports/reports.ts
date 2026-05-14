import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DriverReportItem,
  ParcelReportItem,
  ReportService,
  ReportSummary,
  RevenueReportItem,
} from '../../../core/services/report.service';
import { TrackingService } from '../../../core/services/tracking.service';
import { ParcelStatus } from '../../../core/models/parcel.model';

@Component({
  selector: 'app-reports',
  imports: [FormsModule],
  templateUrl: './reports.html',
})
export class Reports {
  summary: ReportSummary = {
    totalParcels: 0,
    delivered: 0,
    inTransit: 0,
    outForDelivery: 0,
    failed: 0,
    totalRevenue: 0,
  };

  parcelReports: ParcelReportItem[] = [];
  revenueReports: RevenueReportItem[] = [];
  driverReports: DriverReportItem[] = [];

  statusFilter = 'ALL';
  dateFrom = '';
  dateTo = '';

  isLoading = false;
  errorMessage = '';

  statuses = [
    { value: 'ALL', label: 'All Status' },
    { value: 'CREATED', label: 'Created' },
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'DELIVERY_FAILED', label: 'Delivery Failed' },
    { value: 'RETURNED_TO_HUB', label: 'Returned to Hub' },
  ];

  constructor(
    private reportService: ReportService,
    private trackingService: TrackingService,
  ) {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reportService.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
      },
      error: () => {
        this.errorMessage = 'Failed to load report summary.';
      },
    });

    this.reportService.getRevenueReport().subscribe({
      next: (reports) => {
        this.revenueReports = reports;
      },
      error: () => {
        this.errorMessage = 'Failed to load revenue report.';
      },
    });

    this.reportService.getDriverReport().subscribe({
      next: (reports) => {
        this.driverReports = reports;
      },
      error: () => {
        this.errorMessage = 'Failed to load driver report.';
      },
    });

    this.loadParcelReport();
  }

  loadParcelReport(): void {
    this.isLoading = true;

    this.reportService
      .getParcelReport({
        status: this.statusFilter,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
      })
      .subscribe({
        next: (reports) => {
          this.parcelReports = reports;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load parcel report.';
          this.isLoading = false;
        },
      });
  }

  resetFilters(): void {
    this.statusFilter = 'ALL';
    this.dateFrom = '';
    this.dateTo = '';
    this.loadParcelReport();
  }

  get deliveredRate(): number {
    if (this.summary.totalParcels === 0) return 0;
    return (this.summary.delivered / this.summary.totalParcels) * 100;
  }

  get failedRate(): number {
    if (this.summary.totalParcels === 0) return 0;
    return (this.summary.failed / this.summary.totalParcels) * 100;
  }

  getStatusLabel(status: string): string {
    return this.trackingService.getStatusLabel(status as ParcelStatus);
  }

  getStatusStyle(status: string): string {
    return this.trackingService.getStatusStyle(status as ParcelStatus);
  }

  exportParcelCsv(): void {
    const headers = [
      'Tracking Number',
      'Sender',
      'Receiver',
      'Status',
      'Delivery Type',
      'Fee',
      'Latest Location',
      'Assigned Driver',
      'Created At',
    ];

    const rows = this.parcelReports.map((parcel) => [
      parcel.trackingNumber,
      parcel.senderName,
      parcel.receiverName,
      this.getStatusLabel(parcel.currentStatus),
      parcel.deliveryType,
      parcel.deliveryFee,
      parcel.latestLocation,
      parcel.assignedDriver || '',
      parcel.createdAt,
    ]);

    this.downloadCsv('parcel-report.csv', headers, rows);
  }

  exportRevenueCsv(): void {
    const headers = ['Month', 'Total Shipments', 'Revenue'];

    const rows = this.revenueReports.map((item) => [item.month, item.totalShipments, item.revenue]);

    this.downloadCsv('revenue-report.csv', headers, rows);
  }

  exportDriverCsv(): void {
    const headers = [
      'Driver',
      'Phone',
      'Vehicle',
      'Vehicle Number',
      'Status',
      'Branch',
      'Assigned Parcels',
      'Delivered',
      'Failed',
    ];

    const rows = this.driverReports.map((driver) => [
      driver.driverName,
      driver.phone,
      driver.vehicleType,
      driver.vehicleNumber,
      driver.availabilityStatus,
      driver.branchName,
      driver.assignedParcels,
      driver.delivered,
      driver.failed,
    ]);

    this.downloadCsv('driver-report.csv', headers, rows);
  }

  printReport(): void {
    window.print();
  }

  private downloadCsv(
    filename: string,
    headers: string[],
    rows: Array<Array<string | number>>,
  ): void {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}
