import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
