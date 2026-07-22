import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { FormSchema } from '../../../core/models/form-schema.model';

declare const bootstrap: any;

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent implements AfterViewInit {
  @Input() modalId: string = 'dynamicModal' + Math.floor(Math.random() * 1000); // Unique ID so multiple can exist
  @Input() title: string = 'Form';
  @Input() schema!: FormSchema;
  @Input() initialValue: any = {};
  @Input() isLoading: boolean = false;

  @Output() submitForm = new EventEmitter<any>();
  @Output() buttonClick = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  @ViewChild('modalElement') modalElement!: ElementRef;
  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  private modalInstance: any;

  ngAfterViewInit() {
    this.modalElement.nativeElement.addEventListener('hide.bs.modal', () => {
      this.modalClosed.emit();
    });
  }

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
  }

  onSubmit(event: any) {
    this.submitForm.emit(event);
  }

  onButtonClick(event: any) {
    this.buttonClick.emit(event);
  }
}
