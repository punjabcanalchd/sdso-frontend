import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss'
})
export class CaptchaComponent {
  @Input() label: string = 'Captcha';
  @Input() control!: FormControl;
  @Input() captchaImage: string | null = null;

  @Output() reloadCaptcha = new EventEmitter<void>();
}
