export interface Branch {
  branchId: number;
  branchCode: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  latitude: number;
  longitude: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}
