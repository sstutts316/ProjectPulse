import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service'; // Import the AuthService
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api'; // Replace with your backend API URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Send a message to the server
  sendMessage(message: string): Observable<any> {
    const userId = this.authService.getUserId(); // Get the user ID from AuthService
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Add the token for authenticated requests
    });

    return this.http.post(`${this.apiUrl}/chat`, { message, userId }, { headers });
  }

  // Get chat history for the logged-in user
  getChatHistory(): Observable<any> {
    const userId = this.authService.getUserId(); // Get the user ID from AuthService
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Add the token for authenticated requests
    });

    return this.http.get(`${this.apiUrl}/chat/${userId}`, { headers });
  }
}
