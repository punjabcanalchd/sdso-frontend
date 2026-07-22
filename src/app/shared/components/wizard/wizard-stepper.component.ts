import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wizard-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wizard-stepper.component.html',
   styleUrls: ['./wizard-stepper.component.scss']

})
export class WizardStepperComponent {

  @Input() steps: any[] = [];
  @Input() currentStep = 0;

  @Input() isValid = false;
  @Input() loading = false;

  @Input() canGoNext: boolean = true;

  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();



  @Output() stepClick = new EventEmitter<number>();

  onStepClick(index: number) {
    this.stepClick.emit(index);
  }

}