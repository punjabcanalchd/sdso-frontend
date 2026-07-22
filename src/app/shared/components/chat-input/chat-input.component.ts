import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
 message = '';

  @Output() send = new EventEmitter<string>();

  submit() {
    if (!this.message.trim()) return;

    this.send.emit(this.message.trim());
    this.message = '';
  }
}
