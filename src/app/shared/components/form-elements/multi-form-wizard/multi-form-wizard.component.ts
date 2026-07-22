import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';


@Component({
  selector: 'app-multi-form-wizard',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormComponent,

  ],
  templateUrl: './multi-form-wizard.component.html',
  styleUrls: ['./multi-form-wizard.component.scss']
})

export class MultiFormWizardComponent implements OnInit, AfterViewInit {
  @Input() forms: any[] = [];
  // @Input() steps: string[] = [];
  @Input() steps: (string | { title: string })[] = [];
  @Input() initialData: any = {};
  @Output() stepSubmit = new EventEmitter<any>();

  @ViewChild('dynamicForm') dynamicForm!: DynamicFormComponent;
  
  currentFormIndex: number = 0;
  formData: any[] = [];
  canGoNext: boolean = true;
  canGoPrev: boolean = false;
  private moveToNextStep = false;


  constructor(private cdr: ChangeDetectorRef) {}


  ngOnInit() {

      this.forms = this.forms.map(form => ({
    ...form,
    isMultiFormWizard: true
  }));
    // Initialize form data with initial values or empty objects
    this.formData = this.forms.map((form, index) => {
      return this.initialData[index] || {};
    });
  }

  ngAfterViewInit() {
    // Initialize form data with initial values or empty objects
    this.formData = this.forms.map((form, index) => {
      return this.initialData[index] || {};
    });
    this.updateNavigationState();
    this.cdr.detectChanges();
  }


  get currentSchema(): any {
  
    const schema = this.forms[this.currentFormIndex];

    if (!schema) {
      return null;
    }
    return this.forms[this.currentFormIndex];

    // return {
    //   ...schema,
    //   isMultiFormWizard: true
    // };

    // return this.forms[this.currentFormIndex] || null;
  }

  get currentData(): any {
    return this.formData[this.currentFormIndex] || {};
  }

  nextForm() {
console.log("check next step");
    const form = this.dynamicForm.form;
console.log("check form",form);

    form.markAllAsTouched();

    if (form.invalid) {
      return;
    }

    this.saveCurrentFormData();

    if (this.currentFormIndex === 0) {
      this.moveNext();
      return;
    }

    this.dynamicForm.onSubmit();
  }


private submitCurrentForm(): void {
  // Call DynamicForm submit method
  this.dynamicForm.onSubmit();

  // Move to next step
  if (this.currentFormIndex < this.forms.length - 1) {
    this.currentFormIndex++;
    this.updateNavigationState();
  }
}

onSubmitSuccess(res: any) {
  if (this.currentFormIndex < this.forms.length - 1) {
    this.currentFormIndex++;
    this.updateNavigationState();
  }
}
 

  prevForm() {
    if (this.currentFormIndex > 0) {
      this.saveCurrentFormData();
      this.currentFormIndex--;
      this.updateNavigationState();
    }
  }


  saveCurrentFormData() {
    if (this.dynamicForm && this.dynamicForm.form) {
      // Save the current form data
      this.formData[this.currentFormIndex] = this.dynamicForm.form.value;
    } else if (this.dynamicForm) {
      // Fallback: if form property doesn't exist
      // this.formData[this.currentFormIndex] = this.dynamicForm.value || {};
    }
  }

  updateNavigationState() {
    this.canGoNext = this.currentFormIndex < this.forms.length - 1;
    this.canGoPrev = this.currentFormIndex > 0;
  }

  // Method to get all form data
  getAllFormData(): any {
    // Save the current form data before returning all
    this.saveCurrentFormData();
    return this.formData;
  }

  // Method to submit all data
  submitAll() {
    this.saveCurrentFormData();
    // Emit or process all form data
    console.log('All Form Data:', this.formData);
  }


  
  // Fix: Ensure index is a number
  goToStep(index: number) {
    if (typeof index !== 'number') {
      console.warn('Invalid step index:', index);
      return;
    }
    
    if (index >= 0 && index < this.forms.length && index !== this.currentFormIndex) {
      this.saveCurrentFormData();
      this.currentFormIndex = index;
      this.updateNavigationState();
    }
  }


//   onCurrentStepSubmit(data: any): void {
//   this.stepSubmit.emit({
//     step: this.currentFormIndex,
//     data
//   });
// }

  moveNext(): void {
  if (this.currentFormIndex < this.forms.length - 1) {
    this.currentFormIndex++;
    this.updateNavigationState();
  }
}
onCurrentStepSubmit(data: any) {

  console.log(data);

  // Call API here

  this.currentFormIndex++;

  this.updateNavigationState();
}
}