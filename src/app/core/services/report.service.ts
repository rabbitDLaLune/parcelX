import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';

export interface ReportSummary {
  totalParcels: number;
  delivered: number;
  inTransit: number;
  outForDelivery: number;
  failed: number;
  totalRevenue: number;
}

export interface ParcelReportItem {
  parcelId: number;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  receiverAddress: string;
  currentStatus: string;
  deliveryType: string;
  deliveryFee: number;
  createdAt: string;
  latestLocation: string;
  assignedDriver: string | null;
}

export interface RevenueReportItem {
  month: string;
  totalShipments: number;
  revenue: number;
}

export interface DriverReportItem {
  driverId: number;
  driverName: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  availabilityStatus: string;
  branchName: string;
  assignedParcels: number;
  delivered: number;
  failed: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<ReportSummary> {
    return this.http
      .get<ApiResponse<ReportSummary>>(`${API_BASE_URL}/reports/summary`)
      .pipe(map((response) => response.data));
  }

  getParcelReport(filters: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<ParcelReportItem[]> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    if (filters.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom);
    }

    if (filters.dateTo) {
      params = params.set('dateTo', filters.dateTo);
    }

    return this.http
      .get<ApiResponse<ParcelReportItem[]>>(`${API_BASE_URL}/reports/parcels`, {
        params,
      })
      .pipe(map((response) => response.data));
  }

  getRevenueReport(): Observable<RevenueReportItem[]> {
    return this.http
      .get<ApiResponse<RevenueReportItem[]>>(`${API_BASE_URL}/reports/revenue`)
      .pipe(map((response) => response.data));
  }

  getDriverReport(): Observable<DriverReportItem[]> {
    return this.http
      .get<ApiResponse<DriverReportItem[]>>(`${API_BASE_URL}/reports/drivers`)
      .pipe(map((response) => response.data));
  }
}
