import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { Parcel, ParcelStatus } from '../models/parcel.model';

export interface DashboardStats {
  totalParcels: number;
  inTransit: number;
  outForDelivery: number;
  delivered: number;
  failed: number;
  totalRevenue: number;
  activeDrivers: number;
}

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  constructor(private http: HttpClient) {}

  trackParcel(trackingNumber: string): Observable<Parcel> {
    return this.http
      .get<ApiResponse<Parcel>>(`${API_BASE_URL}/tracking/${trackingNumber}`)
      .pipe(map((response) => response.data));
  }

  getAllParcels(): Observable<Parcel[]> {
    return this.http
      .get<ApiResponse<Parcel[]>>(`${API_BASE_URL}/parcels`)
      .pipe(map((response) => response.data));
  }

  getParcelById(parcelId: number): Observable<Parcel> {
    return this.http
      .get<ApiResponse<Parcel>>(`${API_BASE_URL}/parcels/${parcelId}`)
      .pipe(map((response) => response.data));
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http
      .get<ApiResponse<DashboardStats>>(`${API_BASE_URL}/parcels/dashboard/stats`)
      .pipe(map((response) => response.data));
  }

  getStatusLabel(status: ParcelStatus): string {
    const labels: Record<ParcelStatus, string> = {
      CREATED: 'Created',
      PENDING_PICKUP: 'Pending Pickup',
      PICKED_UP: 'Picked Up',
      ARRIVED_ORIGIN_HUB: 'Arrived at Origin Hub',
      DEPARTED_ORIGIN_HUB: 'Departed Origin Hub',
      ARRIVED_SORTING_HUB: 'Arrived at Sorting Hub',
      IN_TRANSIT: 'In Transit',
      ARRIVED_DESTINATION_HUB: 'Arrived at Destination Hub',
      ASSIGNED_TO_DRIVER: 'Assigned to Driver',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      DELIVERY_FAILED: 'Delivery Failed',
      RETURNED_TO_HUB: 'Returned to Hub',
      RETURNED_TO_SENDER: 'Returned to Sender',
      CANCELLED: 'Cancelled',
    };

    return labels[status];
  }

  getStatusStyle(status: ParcelStatus): string {
    if (status === 'DELIVERED') {
      return 'bg-emerald-100 text-emerald-700';
    }

    if (status === 'DELIVERY_FAILED' || status === 'CANCELLED') {
      return 'bg-red-100 text-red-700';
    }

    if (status === 'OUT_FOR_DELIVERY') {
      return 'bg-orange-100 text-orange-700';
    }

    if (status === 'IN_TRANSIT') {
      return 'bg-blue-100 text-blue-700';
    }

    return 'bg-slate-100 text-slate-700';
  }

  createParcel(payload: unknown): Observable<Parcel> {
    return this.http
      .post<ApiResponse<Parcel>>(`${API_BASE_URL}/parcels`, payload)
      .pipe(map((response) => response.data));
  }

  updateParcelStatus(parcelId: number, payload: unknown): Observable<Parcel> {
    return this.http
      .post<ApiResponse<Parcel>>(`${API_BASE_URL}/parcels/${parcelId}/status`, payload)
      .pipe(map((response) => response.data));
  }

  assignDriver(parcelId: number, payload: unknown): Observable<Parcel> {
    return this.http
      .post<ApiResponse<Parcel>>(`${API_BASE_URL}/parcels/${parcelId}/assign-driver`, payload)
      .pipe(map((response) => response.data));
  }

  markDelivered(parcelId: number, payload: unknown): Observable<Parcel> {
    return this.http
      .post<ApiResponse<Parcel>>(`${API_BASE_URL}/parcels/${parcelId}/delivered`, payload)
      .pipe(map((response) => response.data));
  }

  markFailed(parcelId: number, payload: unknown): Observable<Parcel> {
    return this.http
      .post<ApiResponse<Parcel>>(`${API_BASE_URL}/parcels/${parcelId}/failed`, payload)
      .pipe(map((response) => response.data));
  }
}
