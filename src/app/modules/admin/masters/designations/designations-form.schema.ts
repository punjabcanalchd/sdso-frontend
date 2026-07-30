import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const DesignationSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn btn-primary-govt',
  steps: [
    {
      title: 'Designation',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter Name',
          required: true,
          className: 'col-md-4',
          validators: [CustomValidators.shortAlpha()]
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter Description',
          className: 'col-md-4',
          validators: [CustomValidators.textContent()]
        },
        {
          name: 'desigsenioritylevel',
          label: 'Seniority Level',
          type: 'number',
          placeholder: 'Enter Code',
          className: 'col-md-4',
          validators: [CustomValidators.digitsOnly()]
        },
        {
          name: 'status',
          label: 'Status',
          type: 'toggle',
          required: true,
          className: 'col-md-4',
          options: [
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' }
          ]
        },
      ]
    },
  ]
};
