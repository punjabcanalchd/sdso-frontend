import { FormGroup } from '@angular/forms';

/**
 * Applies backend validation errors to form controls
 */
export function applyApiErrors(
  form: FormGroup,
  errors: any[] | null,
  setGlobalError: (msg: string) => void
) {
  if (!errors || errors.length === 0) return;

  errors.forEach(err => {
    const field =
      err.field ??
      (Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : null);

    const message = err.message || err.msg || 'Invalid input';

    const control = field ? form.get(field) : null;

    if (control) {
      control.setErrors({ serverError: message });
      control.markAsTouched();
      control.updateValueAndValidity({ onlySelf: true });
    } else {
      setGlobalError(message);
    }
  });
}

/**
 * Clears server-side errors before submit
 */
export function clearServerErrors(form: FormGroup) {
  Object.values(form.controls).forEach(control => {
    if (control.hasError('serverError')) {
      control.setErrors(null);
    }
  });
}
