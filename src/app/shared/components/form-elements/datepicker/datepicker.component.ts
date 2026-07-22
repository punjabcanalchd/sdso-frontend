import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {

  @Input({ required: true }) control!: FormControl;

  @Input() label = '';
  @Input() placeholder = 'Select Date';

  @Input() min = '';
  @Input() max = '';

  @Input() required = false;
  @Input() readonly = false;
  @Input() disabled = false;

  @Output() changed = new EventEmitter<string>();

  onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.changed.emit(value);
  }
}