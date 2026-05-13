import { ParcelStatus } from './parcel.types';

export interface CreateParcelRequest {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  originBranchId: number;
  destinationBranchId: number;
  currentBranchId?: number;
  parcelWeight: number;
  parcelSize: 'Small' | 'Medium' | 'Large';
  parcelCategory: string;
  deliveryType: 'Standard Delivery' | 'Express Delivery' | 'Same-Day Delivery';
  deliveryFee: number;
  estimatedDeliveryDate: string;
}

export interface UpdateParcelStatusRequest {
  status: ParcelStatus;
  title: string;
  locationName: string;
  branchId?: number;
  latitude?: number;
  longitude?: number;
  remarks: string;
  updatedBy: string;
}

export interface AssignDriverRequest {
  driverId: number;
  assignedBy?: string;
}

export interface DeliveryProofRequest {
  receiverName: string;
  deliveryNote?: string;
}
