import { FormGroup } from '@angular/forms';
import { FormSchema } from '../../../core/models/form-schema.model';




/* ---------------- CSS CLASS RESOLUTION ---------------- */
export function getFormClasses(schema: FormSchema): string {
  const base = 'mx-auto w-full transition-all duration-500 ease-in-out ';
  switch (schema.layoutStyle) {
    case 'popup':
      return base + 'max-w-full px-3 py-2';
    case 'minimal':
      return base + 'max-w-[500px] p-8';
    case 'compact':
      return base + 'max-w-[600px] p-6  border-slate-200 rounded-xl shadow-sm';
    case 'creative':
      return base + 'max-w-[650px] p-12 rounded-[3rem] border-none shadow-2xl relative overflow-hidden';
    default:
      return base + 'max-w-[550px] p-10 rounded-[24px] shadow-2xl  border-slate-50';
  }
}

/* ---------------- VALIDATION HELPERS ---------------- */
export function isInvalid(form: FormGroup, field: string): boolean {
  const control = form.get(field);
  return !!(control && control.invalid && (control.dirty || control.touched));
}

// export function getErrorMessage(form: FormGroup, field: string): string {
//   const control = form.get(field);
//   if (!control || !control.errors) return '';

//   if (control.errors['required']) return 'This field is required';
//   // Custom validator message ( THIS IS THE FIX)
//   if (control.errors['validationMessage']) {
//     return control.errors['validationMessage'];
//   }
//   if (control.errors['serverError']) return control.errors['serverError'];

//   if (control.errors['duplicateName']) return 'This name is already taken';

//   return 'Invalid input';
// }

export function getErrorMessage(form: FormGroup, field: string): string {

  const control = form.get(field);

  if (!control || !control.errors) {
    return '';
  }

  if (control.errors['required']) {
    return 'This field is required';
  }

  if (control.errors['validationMessage']) {
    return control.errors['validationMessage'];
  }

  if (control.errors['serverError']) {
    return control.errors['serverError'];
  }

  if (control.errors['duplicateName']) {
    return 'This name is already taken';
  }

  return 'Invalid input';
}