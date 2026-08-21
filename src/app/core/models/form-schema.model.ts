import { AfterViewInit, OnInit, Component, ViewChild } from '@angular/core';
import { ValidatorFn } from "@angular/forms";
import { TabSchema } from './tab-schema';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'datepicker'
  | 'slider'
  | 'toggle'
  | 'range'
  | 'file'
  | 'captcha'
  | 'radio'
  | 'group'
  | 'multi-checkbox'
  | 'editor'  
  | 'custom-permission' | 'role-assignment' | 'html';

export interface FormOption {
  label: string;
  value: string | number;

}

export interface FormSection {
  sectionTitle: string;
  fields?: FormField[];  // 'FieldConfig' being whatever your field object type is
  
}

export type Layouts =
  | 'modern'
  | 'minimal'
  | 'compact'
  | 'creative'
  | 'elegant'
  | 'popup';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  text?: string;
  min?: number;
  max?: number;
  step?: number;
  fields?: FormField[];
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  options?: { label: string; value: any }[];
  updateOn?: 'change' | 'blur' | 'submit';
  icon?: string;
  html?: string;
  minDate?: string;
  maxDate?: string;
 languageCode?: string;
 languageId?: number;
  visibleWhen?: {
    field: string;
    value: any;
  }
  maskOnBlur?: boolean;
    copyKey?: string;
  // syncKey?: string;  
  inputClass?: string;
  validationMessages?: {
    [key: string]: string;
  };

  tab?: string;
  validators?: ValidatorFn[];
  clickable?: boolean;
  matchField?: string;
  showPasswordToggle?: boolean;
  show?: boolean;
  defaultValue?: any;

}
export interface CaptchaConfig {
  enabled: boolean;
}

// Steps for Wizard 
export interface FormStep {
  title?: string;
  fields: FormField[];
}

export interface FormButton {
  type?: 'button' | 'submit' | 'reset';
  label: string;
  icon?: string;
  class?: string;
  action?: string;
  disabled?: boolean;
  ignoreFormValidation?: boolean;
  visible?: boolean;
    overrideClasses?: boolean;
}

export interface FormSchema {
  layoutStyle?: Layouts;
  submitLabel?: string;
  title?: string;         // Optional Header Title
  description?: string;   // Optional Header Sub-text
  logoUrl?: string;       // Optional Logo Image URL
  footerText?: string;    // Optional Footer Text
  captcha?: CaptchaConfig;
  
  addActionString?: string; 
  isWizard?: boolean;
  isMultiFormWizard?: boolean;
  steps?: FormStep[];
  multiFormWithWizard?: boolean;
  buttons?: FormButton[];

  forgotPassword?: {
    enabled: boolean;
    text?: string;
    route?: string;
    class?: string;
  };
  
  tabs?: TabSchema[];
  [key: string]: any;
  icon?: string;
  submitIcon?: string;
  fields?: FormField[];
  submitClass?: string;
  formClass?: string;
  sections?: FormSection[];
  showCustomButtons?: boolean;
  buttonContainerClass?: string;
}


