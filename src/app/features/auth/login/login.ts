import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = 'admin@parcelx.com';
  password = 'Admin@123';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.authService.redirectByRole();
      },
      error: () => {
        this.errorMessage = 'Invalid email or password.';
        this.isLoading = false;
      },
    });
  }
}
