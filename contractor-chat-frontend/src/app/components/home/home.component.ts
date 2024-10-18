import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container">
      <h1>ProjectPulse</h1>
      <p>Welcome to the Contractor Chat App!</p>
      <nav>
        <a routerLink="/login">Login</a>
        <a routerLink="/register">Register</a>
      </nav>
    </div>
  `,
  imports: [RouterModule]
})
export class HomeComponent {}

