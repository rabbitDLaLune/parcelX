import { RowDataPacket } from 'mysql2';

export type UserRole = 'admin' | 'staff' | 'driver' | 'customer';

export interface UserRow extends RowDataPacket {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  phone: string | null;
  status: 'active' | 'inactive';
  created_at: Date;
}

export interface JwtUserPayload {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}
