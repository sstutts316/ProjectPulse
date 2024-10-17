import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ChatComponent implements OnInit {
  newMessage: string = ''; 
  messages: { user: string; content: string }[] = []; 
  userId: number = 1; // Assuming user ID is known
  apiUrl = 'http://localhost:5000/api/chat'; // Backend endpoint

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    // Fetch chat history when the component loads
    await this.getChatHistory();
  }

  async getChatHistory(): Promise<void> {
    const token = localStorage.getItem('authToken');
    try {
      const data = await firstValueFrom(
        this.http.get<{ id: number; user_id: number; message: string; created_at: string }[]>(`${this.apiUrl}/${this.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      this.messages = data.map(chat => ({ user: chat.user_id === this.userId ? 'You' : 'Contractor', content: chat.message }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim()) {
      const token = localStorage.getItem('authToken');
      try {
        const response: any = await firstValueFrom(
          this.http.post(`${this.apiUrl}`, { userId: this.userId, message: this.newMessage }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        this.messages.push({ user: 'You', content: this.newMessage });
        this.messages.push({ user: 'Contractor', content: response.aiResponse });
        this.newMessage = '';
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }
}
