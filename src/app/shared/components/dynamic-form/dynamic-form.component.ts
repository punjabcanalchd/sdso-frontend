import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormSchema } from '../../../core/models/form-schema.model';
import { ThemeService } from '../../../core/services/theme.service';
import { buildFormGroup } from './dynamic-form.builder';
import { applyApiErrors, clearServerErrors } from './dynamic-form.errors';
import { getFormClasses, isInvalid, getErrorMessage } from './dynamic-form.utils';
import { ClearGlobalErrorOnFocusDirective } from "../../directives/app-clear-global-errors-on-focus.directive";
import { CaptchaComponent } from '../form-elements/captcha/captcha.component';
import { DatepickerComponent } from '../form-elements/datepicker/datepicker.component';
import { FormControl } from '@angular/forms';
import { SliderComponent } from '../form-elements/slider/slider.component';
import { ToggleComponent } from '../form-elements/toggle/toggle.component';
import { RangeComponent } from '../form-elements/range/range.component';
import { FileUploadComponent } from '../form-elements/file-upload/file-upload.component';
import { CustomValidators } from '../../../common/validation/custom-validators';
import { WizardStepperComponent } from '../../components/wizard/wizard-stepper.component';
import { CustomPermissionComponent } from '../form-elements/custom-permission/custom-permission.component';
import { TinymceEditorComponent } from '../tinymce-editor/tinymce-editor.component';
import { RoleAssignmentComponent } from '../form-elements/role-assignment/role-assignment.component';
import { TabsComponent } from '../tabs/tabs.component';
import { FormField } from '../../../core/models/form-schema.model';
import { LanguageService } from '../../../core/services/language.service';

import { englishFields } from '../../../common/tabs/english-tab';
import { punjabiFields } from '../../../common/tabs/punjabi-tab';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, ClearGlobalErrorOnFocusDirective, CaptchaComponent,
    DatepickerComponent, SliderComponent, ToggleComponent, RangeComponent, FileUploadComponent, WizardStepperComponent,
    CustomPermissionComponent, TinymceEditorComponent, RoleAssignmentComponent,TabsComponent],

  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})

export class DynamicFormComponent implements OnInit, OnChanges {

  /* ---------------- INPUTS (UI STATE) ---------------- */
  @Input() schema!: FormSchema;
  @Input() resendTimer = 0;
  @Input() initialValue: any = null; // New input for editing

  @Input() readOnly: boolean = false;   //  MUST EXIST

  @Input() captchaImage: string | null = null;
  @Input() captchaId: string | null = null; @Input() lockoutTimer = 0;
  @Input() isLocked = false;
  @Input() hideChrome: boolean = false;   //  new input

  @Input() showTitle: boolean = true;
  activeTab = 'general';
  activeChildTab = 'general-english';
  private _formData: any = null;

  @Input()
  set formData(val: any) {

    this._formData = val;

    if (val && this.form) {

      const data = this.prepareInitialValue(val);

      console.log('formData received:', data);

      this.form.patchValue(data, {
        emitEvent: false
      });

    }
  }
  
  

  /* ---------------- OUTPUTS ---------------- */
  @Output() submitForm = new EventEmitter<any>();
  @Output() reloadCaptcha = new EventEmitter<void>();
  @Output() resendOtp = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() permissionClick = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<any>();
  @Input() initialData: any;

  /* ---------------- INTERNAL STATE ---------------- */
  form!: FormGroup;
  loading = false;
  generalErrorMessage: string | null = null;
  currentTheme: any = '';

  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService,
    private languageService: LanguageService
  ) { }

  clearGlobalError(): void {
    // Clear only the global error
    this.generalErrorMessage = null;
  }

  ngOnInit() {
  this.initForm();


      // 1. Build the form
  // this.form = buildFormGroup(this.fb, this.schema);

   console.log(
    'Form controls:',
    Object.keys(this.form.controls)
  );

  // 2. Patch initial data
  if (this.initialValue) {

    const data = this.prepareInitialValue(this.initialValue);

    console.log('Prepared form data:', data);

    this.form.patchValue(data, {
      emitEvent: false
    });
  }

  // 3. Also handle initialData if provided
  if (this.initialData) {

    const data = this.prepareInitialValue(this.initialData);

    console.log('Prepared initialData:', data);

    this.form.patchValue(data, {
      emitEvent: false
    });
  }
   
  }

ngOnChanges(changes: SimpleChanges): void {

  if (changes['schema'] && this.schema) {
    this.initForm();
    return;
  }

  if (changes['initialValue'] && !changes['initialValue'].firstChange) {

    if (this.form) {

      const data = this.prepareInitialValue(
        changes['initialValue'].currentValue
      );

      console.log('initialValue changed:', data);

      this.form.patchValue(data, {
        emitEvent: false
      });

    }

  }

  if (changes['initialData'] && this.form) {

    const data = this.prepareInitialValue(
      changes['initialData'].currentValue
    );

    console.log('initialData changed:', data);

    this.form.patchValue(data, {
      emitEvent: false
    });

  }

}
  /**
   * Logic to build the form group and patch values if they exist.
   */


  private initForm(): void {

  this.form = buildFormGroup(this.fb, this.schema);

  if (this.initialValue) {

    const data = this.prepareInitialValue(this.initialValue);

    console.log('INITIAL VALUE AFTER PREPARE:', data);

    this.form.patchValue(data, { emitEvent: false });

    console.log('FORM AFTER PATCH:', this.form.getRawValue());
  }

  if (this.initialData) {

    const data = this.prepareInitialValue(this.initialData);

    console.log('INITIAL DATA AFTER PREPARE:', data);

    this.form.patchValue(data, { emitEvent: false });

    console.log('FORM AFTER PATCH INITIAL DATA:', this.form.getRawValue());
  }

  if (this._formData) {

    const data = this.prepareInitialValue(this._formData);

    console.log('FORM DATA AFTER PREPARE:', data);

    this.form.patchValue(data, { emitEvent: false });

    console.log('FORM AFTER PATCH FORM DATA:', this.form.getRawValue());
  }
}
//  private initForm(): void {

//   this.form = buildFormGroup(this.fb, this.schema);

//   if (this.initialValue) {

//     this.form.patchValue(
//       this.prepareInitialValue(this.initialValue),
//       { emitEvent: false }
//     );

//   }

//   if (this.initialData) {

//     this.form.patchValue(
//       this.prepareInitialValue(this.initialData),
//       { emitEvent: false }
//     );

//   }

//   if (this._formData) {

//     this.form.patchValue(
//       this.prepareInitialValue(this._formData),
//       { emitEvent: false }
//     );

//   }
// }

  /* ---------------- API STATE ---------------- */
  setLoading(state: boolean) {
    this.loading = state;
    state ? this.form.disable() : this.form.enable();
  }

  setApiErrors(errors: any[] | null, message?: string) {
    this.generalErrorMessage = message || null;
    applyApiErrors(this.form, errors, msg => {
      this.generalErrorMessage = msg;
    });
  }

  /* ---------------- FORM SUBMIT ---------------- */
onSubmit(): void {
  this.generalErrorMessage = null;
  clearServerErrors(this.form);

  // Get the complete form data
  const formValue = this.form.getRawValue();

  console.log('FORM SUBMIT DATA:', formValue);

  // Validate form
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }


  const languageData = this.prepareLanguageData();

  console.log('LANGUAGE SUBMIT DATA:', languageData);

  // Send complete form data
  this.submitForm.emit({
    ...formValue,
    languages: languageData
  });

  // this.submitForm.emit(formValue);
}

  onReloadCaptcha() {
    this.reloadCaptcha.emit();
  }

  /* ---------------- TEMPLATE HELPERS ---------------- */
  getFormClasses = () => getFormClasses(this.schema);
  isInvalid = (field: string) => isInvalid(this.form, field);
  getErrorMessage = (field: string) => getErrorMessage(this.form, field);

  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  

  get inputClasses() {
    return {
      'input-popup': this.schema.layoutStyle === 'popup',
      'input-minimal': this.schema.layoutStyle === 'minimal',
      'input-compact': this.schema.layoutStyle === 'compact',
      'input-creative': this.schema.layoutStyle === 'creative',
      'input-elegant': this.schema.layoutStyle === 'elegant',
      'input-modern': this.schema.layoutStyle === 'modern' || !this.schema.layoutStyle
    };
  }





  onFileSelect(event: Event, field: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ [field.name]: file });
    }
  }

  onOtpInput(event: any, field: any, index: number) {
    // optional OTP aggregation logic
  }


  onMultiCheckboxChange(fieldName: string, optionValue: any, event: any) {
    const control = this.form.get(fieldName);
    const currentValues = Array.isArray(control?.value) ? [...control.value] : [];

    if (event.target.checked) {
      // Add if not present
      if (!currentValues.includes(optionValue)) {
        control?.setValue([...currentValues, optionValue]);
      }
    } else {
      // Remove if present
      control?.setValue(currentValues.filter(val => val !== optionValue));
    }

    control?.markAsDirty();
    control?.markAsTouched();
  }

  // ADD ALL METHODS HERE ↓
  isReadOnly(field: any): boolean {
    return field.readOnly || false;
  }

  /* ---------------- WIZARD ---------------- */

  currentStep = 0;

  get isWizard(): boolean {
    return !!this.schema.steps;
  }

  get steps() {
    return this.schema.steps || [];
  }

  get currentFields() {
    return this.steps[this.currentStep]?.fields || [];
  }

  nextStep() {
    let valid = true;

    this.currentFields.forEach((field: any) => {
      const control = this.form.get(field.name);

      control?.markAsTouched();

      if (control?.invalid) {
        valid = false;
      }
    });

    if (valid && this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {

    return this.currentFields.every(field => {

      const control = this.form.get(field.name);

      return control?.valid;

    });

  }

  onBlur(event: Event, field: any): void {

    if (!field.maskOnBlur) return;

    const input = event.target as HTMLInputElement;
    const control = this.form.get(field.name);

    if (!control || !control.valid) return;

    // Display only masked text
    input.value = CustomValidators.maskIdProof(control.value);
  }

  onFocus(event: Event, field: any): void {

    if (!field.maskOnBlur) return;

    const input = event.target as HTMLInputElement;
    const control = this.form.get(field.name);

    if (!control) return;

    input.value = control.value;
  }

  getFieldClass(field: any): string {
    if (field.className) {
      return field.className;
    }

    if (field.type === 'html') {
      return 'col-12';
    }
    if (this.isWizard) {
      return 'col-md-6';
    }

    if (this.schema?.isMultiFormWizard) {
      return 'col-md-4';
    }

    if (this.schema?.layoutStyle === 'compact') {
      return 'col-md-6';
    }

    return 'col-12';
  }

  handleButtonClick(button: any) {
    this.buttonClick.emit({
      action: button.action,
      formValue: this.form.value
    });

  }

  limitMobileLength(event: Event, field: any): void {
    if (field.name === 'mobileNumber' || field.name === 'mobile_number') {
      const input = event.target as HTMLInputElement;

      if (input.value.length > 10) {
        input.value = input.value.slice(0, 10);
        this.form.get(field.name)?.setValue(input.value, {
          emitEvent: false
        });
      }
    }
  }

  preventInvalidNumberChars(event: KeyboardEvent, field: any): void {
    const input = event.target as HTMLInputElement;
    const maxLength = field.max || ((field.name === 'mobileNumber' || field.name === 'mobile_number') ? 10 : null);

    // 1. If it's a mobile number, strictly block 'e', plus, minus, and decimals!
    if (field.name === 'mobileNumber' || field.name === 'mobile_number') {
      if (['e', 'E', '+', '-', '.'].includes(event.key)) {
        event.preventDefault();
        return;
      }
    } else {
      if (['e', 'E'].includes(event.key)) {
        event.preventDefault();
        return;
      }
    }

    if (maxLength && input.value.length >= maxLength) {
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
      if (!allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  get hasSingleButton(): boolean {
    return (this.schema?.buttons?.length ?? 0) === 1;
  }

  get hasMultipleButtons(): boolean {
    return (this.schema?.buttons?.length ?? 0) > 1;
  }

  goToStep(stepIndex: number) {
    if (stepIndex < this.currentStep) {
      this.currentStep = stepIndex;
    }
  }

  submitCurrentForm(): boolean {

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return false;
    }

    this.submitForm.emit(this.form.value);

    return true;
  }

  validateCurrentForm(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  shouldShowSubmitButton(): boolean {

    if (this.schema?.isMultiFormWizard) {
      return false;
    }

    if (this.schema?.buttons?.length) {
      return false;
    }

    if (!this.isWizard) {
      return true;
    }

    return this.currentStep === this.steps.length - 1;
  }


  isFieldInActiveTab(field: any): boolean {
  // Existing fields without a tab remain visible
  if (!field.tab) {
    return true;
  }

  // If the form doesn't use tabs, don't change existing behavior
  if (!this.schema.tabs?.length) {
    return true;
  }

  // Only tab-specific fields are filtered
  return field.tab === this.activeChildTab;
}

isFieldVisible(field: any): boolean {
  if (!field.visibleWhen) {
    return true;
  }

  const condition = field.visibleWhen;
  const targetControl = this.form.get(condition.field);

  if (!targetControl) {
    return false;
  }

  const currentValue = targetControl.value;

  if (Array.isArray(condition.value)) {
    return condition.value.includes(currentValue);
  }

  return currentValue === condition.value;
}

  forceNumericText(event: Event, field: any): void {
    if (field.name === 'mobileNumber' || field.name === 'mobile_number') {
      const input = event.target as HTMLInputElement;

      const numbersOnly = input.value.replace(/[^0-9]/g, '');

      if (input.value !== numbersOnly) {
        input.value = numbersOnly;
        this.form.get(field.name)?.setValue(numbersOnly, { emitEvent: false });
      }
    }
  }




onTabChange(tab: string): void {
  this.activeTab = tab;
}

onChildTabChange(childTab: string): void {
  console.log('childTab:', childTab);

  this.activeChildTab = childTab;
}


// add checkbox english to punjabi 

private copyEnglishToPunjabi(): void {

    const allFields: FormField[] = this.schema.fields ?? [];

    const englishFields = allFields.filter(
      field => field.tab === 'general-english'
    );

    const punjabiFields = allFields.filter(
      field => field.tab === 'general-punjabi'
    );

    const values: Record<string, any> = {};

    for (const englishField of englishFields) {

      if (!englishField.copyKey) {
        continue;
      }

      const punjabiField = punjabiFields.find(
        field => field.copyKey === englishField.copyKey
      );

      if (!punjabiField) {
        continue;
      }

      values[punjabiField.name] =
        this.form.get(englishField.name)?.value || '';
    }

    this.form.patchValue(values);
  }


  onSameAsEnglishChange(checked: boolean): void {

    if (!checked) {
      return;
    }

    this.copyEnglishToPunjabi();
  }



private prepareInitialValue(data: any): any {

  const result: any = {};

  if (!Array.isArray(data)) {
    return data || {};
  }

  for (const row of data) {

    if (
      row.language_id ===
      this.languageService.getLanguageId('en')
    ) {
      result.name_en = row.name ?? '';
      result.description_en = row.description ?? '';
    }

    if (
      row.language_id ===
      this.languageService.getLanguageId('pb')
    ) {
      result.name_pb = row.name ?? '';
      result.description_pb = row.description ?? '';
    }
  }

  return result;
}


onEditorValueChange(fieldName: string, value: string): void {


   console.log('EDITOR FIELD:', fieldName);
  console.log('EDITOR VALUE:', value);

  const control = this.form.get(fieldName);

  if (!control) {
    console.error(`Editor control not found: ${fieldName}`);
    return;
  }

  control.setValue(value);
  control.markAsDirty();
}




private prepareLanguageData(): any[] {

  const value = this.form.getRawValue();

  return [
    {
      language_id: this.languageService.getLanguageId('en'),
      name: value.name_en ?? '',
      description: value.description_en ?? ''
    },
    {
      language_id: this.languageService.getLanguageId('pb'),
      name: value.name_pb ?? '',
      description: value.description_pb ?? ''
    }
  ];
}

}