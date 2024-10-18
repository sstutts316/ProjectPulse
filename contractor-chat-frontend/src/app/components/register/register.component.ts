import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule],
  providers: [HttpClient] // Ensure HttpClient is provided
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  async register() {
    try {
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:5000/api/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })
      );
      localStorage.setItem('authToken', response.token);
      this.router.navigate(['/chat']);
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
    }
  }
}
