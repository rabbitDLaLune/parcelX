import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AuthUser, LoginResponse, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'parcelx_token';
  private userKey = 'parcelx_user';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response) => response.data),
        tap((data) => {
          localStorage.setItem(this.tokenKey, data.token);
          localStorage.setItem(this.userKey, JSON.stringify(data.user));
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) return null;

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.getUser();
    return !!user && roles.includes(user.role);
  }

  redirectByRole(): void {
    const user = this.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    if (user.role === 'staff') {
      this.router.navigate(['/staff/dashboard']);
      return;
    }

    if (user.role === 'driver') {
      this.router.navigate(['/driver/dashboard']);
      return;
    }

    if (user.role === 'customer') {
      this.router.navigate(['/customer/dashboard']);
      return;
    }

    this.router.navigate(['/']);
  }
}
