import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-driver-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './driver-layout.html',
})
export class DriverLayout {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
