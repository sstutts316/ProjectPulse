import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  imports: [CommonModule, FormsModule],
  providers: [HttpClient],
})
export class ChatComponent {
  newMessage: string = ''; 
  messages: { user: string; content: string }[] = []; 
  apiUrl = 'http://localhost:5000/api/chat'; // Backend endpoint

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const parsedUserId = parseInt(userId, 10);  // Convert to integer
      if (!isNaN(parsedUserId)) {
        // Fetch chat history when the component loads
        await this.getChatHistory(parsedUserId);
      } else {
        console.error('Invalid userId:', userId);
      }
    } else {
      console.error('userId not found in localStorage');
    }
  }

  async getChatHistory(userId: number): Promise<void> {
    const token = localStorage.getItem('authToken');
    try {
      const data = await firstValueFrom(
        this.http.get<{ id: number; user_id: number; message: string; created_at: string }[]>(`${this.apiUrl}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      this.messages = data.map(chat => ({ user: chat.user_id === userId ? 'You' : 'Contractor', content: chat.message }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim()) {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      if (userId) {
        const parsedUserId = parseInt(userId, 10);
        if (!isNaN(parsedUserId)) {
          try {
            const response: any = await firstValueFrom(
              this.http.post(`${this.apiUrl}`, { userId: parsedUserId, message: this.newMessage }, {
                headers: { Authorization: `Bearer ${token}` },
              })
            );
            this.messages.push({ user: 'You', content: this.newMessage });
            this.messages.push({ user: 'Contractor', content: response.aiResponse });
            this.newMessage = '';
          } catch (error) {
            console.error('Failed to send message:', error);
          }
        } else {
          console.error('Invalid userId:', userId);
        }
      } else {
        console.error('userId not found in localStorage');
      }
    }
  }
}
