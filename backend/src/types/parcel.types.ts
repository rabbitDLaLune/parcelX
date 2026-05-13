export type ParcelStatus =
  | 'CREATED'
  | 'PENDING_PICKUP'
  | 'PICKED_UP'
  | 'ARRIVED_ORIGIN_HUB'
  | 'DEPARTED_ORIGIN_HUB'
  | 'ARRIVED_SORTING_HUB'
  | 'IN_TRANSIT'
  | 'ARRIVED_DESTINATION_HUB'
  | 'ASSIGNED_TO_DRIVER'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'RETURNED_TO_HUB'
  | 'RETURNED_TO_SENDER'
  | 'CANCELLED';

export interface TrackingEvent {
  eventId: number;
  status: ParcelStatus;
  title: string;
  locationName: string;
  remarks: string;
  createdAt: string;
  updatedBy: string;
  latitude?: number;
  longitude?: number;
}

export interface Parcel {
  parcelId: number;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  originBranch: string;
  destinationBranch: string;
  latestLocation: string;
  assignedDriver?: string;
  parcelWeight: number;
  parcelSize: 'Small' | 'Medium' | 'Large';
  parcelCategory: string;
  deliveryType: 'Standard Delivery' | 'Express Delivery' | 'Same-Day Delivery';
  deliveryFee: number;
  currentStatus: ParcelStatus;
  estimatedDeliveryDate: string;
  createdAt: string;
  trackingEvents: TrackingEvent[];
}
