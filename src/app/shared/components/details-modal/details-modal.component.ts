import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { FormSchema } from '../../../core/models/form-schema.model';

declare const bootstrap: any;

export interface DetailItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-details-modal',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './details-modal.component.html'
})
export class DetailsModalComponent {
  @Input() modalId: string = 'detailsModal_' + Math.floor(Math.random() * 1000);
  @Input() title: string = 'Details';
  
  // 1. The Details Data
  @Input() details: DetailItem[] = []; 
  
  // 2. The Form Condition & Schema
  @Input() showForm: boolean = false;
  @Input() formSchema!: FormSchema;
  @Input() initialFormValue: any = {};

  @Output() submitForm = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  @ViewChild('modalElement') modalElement!: ElementRef;
  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  private modalInstance: any;

  open() {
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    }
    this.modalInstance.show();
  }

  close() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.modalClosed.emit();
  }

  onSubmit(event: any) {
    this.submitForm.emit(event);
  }
}
