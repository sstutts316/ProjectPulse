import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:5000/api/register', {
      name: this.name,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response: any) => {
        // Save token, show success message
        localStorage.setItem('token', response.token);
        this.successMessage = 'Registration successful!';
        // Optionally redirect after a delay
        setTimeout(() => this.router.navigate(['/chat']), 2000);
      },
      error: (error) => {
        this.errorMessage = 'Registration failed: ' + (error.error || 'Please try again.');
      },
      complete: () => {
        console.log('Registration process completed.');
      }
    });
  }
}
