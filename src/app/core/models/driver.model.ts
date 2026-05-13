export interface Driver {
  driverId: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  branchId: number;
  branchName: string;
  vehicleType: 'Motorcycle' | 'Van' | 'Lorry';
  vehicleNumber: string;
  licenseNumber: string;
  availabilityStatus: 'Available' | 'On Delivery' | 'Offline' | 'Inactive';
  assignedParcelCount: number;
  completedToday: number;
  failedToday: number;
  createdAt: string;
}
