import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Function to handle login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Function to store the JWT token in local storage
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // Function to get the token from local storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
