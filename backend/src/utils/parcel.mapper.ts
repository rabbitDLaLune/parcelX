import { Parcel, ParcelStatus, TrackingEvent } from '../types/parcel.types';
import { ParcelRow, TrackingEventRow } from '../types/mysql-row.types';

function formatDateTime(value: string | Date | null): string {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(value: string | Date | null): string {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function mapTrackingEventRow(row: TrackingEventRow): TrackingEvent {
  return {
    eventId: row.event_id,
    status: row.status as ParcelStatus,
    title: row.title,
    locationName: row.location_name || '',
    remarks: row.remarks || '',
    createdAt: formatDateTime(row.created_at),
    updatedBy: row.updated_by || 'System',
    latitude: row.latitude === null ? undefined : Number(row.latitude),
    longitude: row.longitude === null ? undefined : Number(row.longitude),
  };
}

export function mapParcelRow(row: ParcelRow, trackingEvents: TrackingEvent[] = []): Parcel {
  return {
    parcelId: row.parcel_id,
    trackingNumber: row.tracking_number,
    senderName: row.sender_name,
    senderPhone: row.sender_phone,
    senderAddress: row.sender_address,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    receiverAddress: row.receiver_address,
    originBranch: row.origin_branch || 'Not assigned',
    destinationBranch: row.destination_branch || 'Not assigned',
    latestLocation: row.latest_location || 'Unknown',
    assignedDriver: row.assigned_driver || undefined,
    parcelWeight: Number(row.parcel_weight),
    parcelSize: row.parcel_size,
    parcelCategory: row.parcel_category,
    deliveryType: row.delivery_type,
    deliveryFee: Number(row.delivery_fee),
    currentStatus: row.current_status as ParcelStatus,
    estimatedDeliveryDate: formatDate(row.estimated_delivery_date),
    createdAt: formatDateTime(row.created_at),
    trackingEvents,
  };
}
