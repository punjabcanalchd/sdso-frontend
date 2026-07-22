import { Component, Input, Output, EventEmitter, inject, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-admin-form-layout',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './admin-form-layout.component.html'
})
export class AdminFormLayoutComponent {
  private location = inject(Location);

  @Input() title: string = 'Form'; 
  @Input() isLoading: boolean = false;
  @Input() schema: any = {};
  @Input() initialValue: any = {};
  @Output() onSubmit = new EventEmitter<any>();

  goBack() {
    this.location.back();
  }

  handleFormEvent(event: any) {
    this.onSubmit.emit(event);
  }
   @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent; 
}
