import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent
  implements OnInit, OnDestroy {

  @Input() control: FormControl | null = null;

  @Input() label = '';

  @Input() placeholder = 'Select time';

  private controlSubscription?: Subscription;

  ngOnInit(): void {

    if (!this.control) {
      console.error(
        'TimePickerComponent: FormControl is required'
      );
      return;
    }

    this.controlSubscription =
      this.control.valueChanges.subscribe(value => {

        console.log(
          'Time value changed:',
          value
        );

      });
  }

  onTimeChange(event: Event): void {

    if (!this.control) {
      return;
    }

    const input =
      event.target as HTMLInputElement;

    const value = input.value;

    console.log(
      'Selected time:',
      value
    );

    this.control.setValue(value);

    this.control.markAsDirty();
    this.control.markAsTouched();
  }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
  }
}