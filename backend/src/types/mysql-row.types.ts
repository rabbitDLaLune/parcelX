import { RowDataPacket } from 'mysql2';

export interface ParcelRow extends RowDataPacket {
  parcel_id: number;
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  origin_branch: string | null;
  destination_branch: string | null;
  latest_location: string | null;
  assigned_driver: string | null;
  parcel_weight: string | number;
  parcel_size: 'Small' | 'Medium' | 'Large';
  parcel_category: string;
  delivery_type: 'Standard Delivery' | 'Express Delivery' | 'Same-Day Delivery';
  delivery_fee: string | number;
  current_status: string;
  estimated_delivery_date: string | Date | null;
  created_at: string | Date;
}

export interface TrackingEventRow extends RowDataPacket {
  event_id: number;
  parcel_id: number;
  status: string;
  title: string;
  location_name: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  remarks: string | null;
  updated_by: string | null;
  created_at: string | Date;
}

export interface DashboardStatsRow extends RowDataPacket {
  totalParcels: number;
  inTransit: number;
  outForDelivery: number;
  delivered: number;
  failed: number;
  totalRevenue: string | number | null;
}
