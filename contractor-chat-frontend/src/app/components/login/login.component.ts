import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Make sure to include this for [(ngModel)]

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule] // Use RouterModule here
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:5000/api/login', {
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.userId);
        this.router.navigate(['/chat']);
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials. Please re-enter your credentials.';
      },
      complete: () => {
        console.log('Login request completed');
      }
    });    
  }
}
