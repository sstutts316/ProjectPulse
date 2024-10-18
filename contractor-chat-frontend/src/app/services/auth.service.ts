import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; // Replace with your backend API URL
  private tokenKey = 'authToken'; // Local storage key for storing JWT
  private userIdKey = 'userId'; // Local storage key for storing user ID

  constructor(private http: HttpClient) { }

  // Register a new user
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  // Login a user
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Logout the user by clearing local storage
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
  }

  // Store the token and userId after successful login/register
  storeUserData(token: string, userId: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userIdKey, userId);
  }

  // Get the token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get the user ID from local storage
  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  // Check if the user is logged in (i.e., token exists)
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
