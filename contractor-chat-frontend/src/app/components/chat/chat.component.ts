import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor directive
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel directive
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { firstValueFrom } from 'rxjs'; // For promise conversion

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule] // Ensure CommonModule and FormsModule are imported here
})
export class ChatComponent {
  newMessage: string = ''; 
  messages: { user: string; content: string }[] = []; 
  userId: number = 1; // Assuming user ID is known
  apiUrl = 'http://localhost:5000/api/chat'; // Backend endpoint

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
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
          this.http.post(this.apiUrl, { userId: this.userId, message: this.newMessage }, {
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
