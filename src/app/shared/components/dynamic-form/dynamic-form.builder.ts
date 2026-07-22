import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormSchema, FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../../common/validation/custom-validators';



export function buildFormGroup(
  fb: FormBuilder,
  schema: FormSchema
): FormGroup {

  const group: Record<string, any> = {};

  const allFields: FormField[] = schema.steps
    ? schema.steps.flatMap(step => step.fields)
    : schema.fields || [];

  allFields.forEach((field: FormField) => {


    // schema.fields.forEach((field: FormField) => {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

      if (field.min !== undefined && field.min !== null) {
      if (field.type === 'number') {
        validators.push(Validators.min(field.min)); 
      } else if (['password', 'text', 'email', 'textarea'].includes(field.type)) {

          validators.push(Validators.minLength(field.min)); 
      }
    }
    if (field.max !== undefined && field.max !== null) {
      if (field.type === 'number') {
        validators.push(Validators.max(field.max)); 
      } else if (['password', 'text', 'email', 'textarea'].includes(field.type)) {
        validators.push(Validators.maxLength(field.max)); 
      }
    }

    if (field.validators?.length) {
      validators.push(...field.validators);
    }

    if (field.type === 'range') {
      group[field.name + '_min'] = fb.control(
        { value: field.min ?? 0, disabled: field.disabled || false },
        {
          validators,
          updateOn: field.updateOn ?? 'change'
        }
      );

      group[field.name + '_max'] = fb.control(
        { value: field.max ?? 100, disabled: field.disabled || false },
        {
          validators,
          updateOn: field.updateOn ?? 'change'
        }
      );

      return; // important stop here
    }

    group[field.name] = fb.control(
      { value: field.type === 'multi-checkbox' ? [] : '', disabled: field.disabled || false },
      {
        validators,
        updateOn: field.updateOn ?? 'change' // DEFAULT SAFE
      }
    );
  });



  // CAPTCHA — special case


  return fb.group(group); //  NO global updateOn
}
