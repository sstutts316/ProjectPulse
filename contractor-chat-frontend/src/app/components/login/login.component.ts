import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const response = await this.authService.login(this.email, this.password).toPromise(); // Use AuthService for login
      this.authService.storeUserData(response.token, response.userId); // Store token and user ID
      this.router.navigate(['/chat']); // Navigate to chat after login
    } catch (error) {
      this.errorMessage = 'Invalid credentials. Please try again.'; // Set error message on failed login
    }
  }
}
