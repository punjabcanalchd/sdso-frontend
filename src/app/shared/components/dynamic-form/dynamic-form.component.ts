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

  @Input() set formData(val: any) {
    if (val && this.form) {
      // This is the "magic" that updates the checkboxes
      this.form.patchValue(val, { emitEvent: true });
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
    public themeService: ThemeService
  ) { }

  clearGlobalError(): void {
    // Clear only the global error
    this.generalErrorMessage = null;
  }

  ngOnInit() {
    this.initForm();
    if (this.schema.tabs?.length) {
      this.activeTab = this.schema.tabs[0].id;
      if(this.schema.tabs[0].tabs?.length) {
        this.activeChildTab = this.schema.tabs[0].tabs[0].id;
      }
      
    }
  }

  /**
   * Listens for changes to Input properties.
   * If the schema or initialValue changes, we rebuild/repatch the form.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] || changes['schema']) {
      this.initForm();
    }
    if (changes['initialData'] && this.form) {
      this.form.patchValue(this.initialData || {});
    }
  };

  /**
   * Logic to build the form group and patch values if they exist.
   */
  private initForm() {
    // 1. Build the structure
    this.form = buildFormGroup(this.fb, this.schema);

    // 2. If data is provided (editing mode), fill the form
    if (this.initialValue) {
      this.form.patchValue(this.initialValue);
    }
  }

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
  onSubmit() {
    this.generalErrorMessage = null;
    clearServerErrors(this.form);

    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
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



  onChildTabChange(tabId: string): void {
  console.log('Selected child tab:', tabId);
  this.activeChildTab = tabId;
}
}