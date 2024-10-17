import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  email: string = ''; 
  password: string = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  // Function to handle login
  login() {
    console.log('Login attempt:', this.email, this.password); // Add log to confirm action
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.saveToken(response.token);
        console.log('Login successful:', response);
        this.router.navigate(['/chat']); // Redirect to the chat component
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Invalid email or password.');
      }
    );
  }
}
