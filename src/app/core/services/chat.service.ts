import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hello! I can help you explore Punjab agriculture statistics.',
      timestamp: new Date()
    }
  ]);

  messages$ = this.messagesSubject.asObservable();

  sendMessage(text: string) {
    const current = this.messagesSubject.value;

    this.messagesSubject.next([
      ...current,
      { role: 'user', text, timestamp: new Date() }
    ]);

    // TODO: Replace with API call
    setTimeout(() => {
      this.messagesSubject.next([
        ...this.messagesSubject.value,
        {
          role: 'assistant',
          text: 'This is a sample response. Backend integration pending.',
          timestamp: new Date()
        }
      ]);
    }, 600);
  }
}
