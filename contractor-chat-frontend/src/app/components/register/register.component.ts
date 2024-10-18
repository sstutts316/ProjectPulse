import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // For navigation after registration

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule] // Ensure FormsModule is imported
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {}

  register() {
    // Simulated registration process
    if (this.email && this.password && this.name) {
      // Successful registration logic
      localStorage.setItem('authToken', 'dummyToken');
      this.successMessage = 'Registration successful!'; // Show success message
      setTimeout(() => {
        this.router.navigate(['/login']); // Redirect to login after success
      }, 2000); // Redirect after 2 seconds
    } else {
      // Error handling logic
      this.errorMessage = 'All fields are required';
    }
  }
}
