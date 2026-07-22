import { Component } from '@angular/core';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { ChatService } from '../../../core/services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.css'
})
export class ChatMessagesComponent {
 messages: ChatMessage[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.messages$.subscribe(msgs => {
      this.messages = msgs;
    });
  }
}
