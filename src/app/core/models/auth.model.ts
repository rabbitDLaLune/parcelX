export type UserRole = 'admin' | 'staff' | 'driver' | 'customer';

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
