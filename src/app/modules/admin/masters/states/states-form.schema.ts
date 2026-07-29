import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const stateSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn btn-primary-govt',
  steps: [
    {
      title: 'State',
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
          name: 'lgdstatecode',
          label: 'State Code',
          type: 'number',
          placeholder: 'Enter State Code',
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
