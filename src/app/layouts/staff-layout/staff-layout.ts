import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-staff-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './staff-layout.html',
})
export class StaffLayout {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
