import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule],
  templateUrl: './captcha.component.html'
})
export class CaptchaComponent {
  @Input() captchaImage!: string;
  @Input() control!: FormControl;

  @Input() label = 'Captcha';
  @Output() reload = new EventEmitter<void>();
}
