import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { englishFields } from '../../../../common/tabs/english-tab';
import { punjabiFields } from '../../../../common/tabs/punjabi-tab';

export const OfficeSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn btn-primary-govt',
  tabs: [

    {
      id: 'general',
      label: 'General',

      tabs: [
        {
          id: 'general-english',
          label: 'English'
        },

        {
          id: 'general-punjabi',
          label: 'Punjabi'
        }
      ]
    },

  ],
  fields: [
    ...englishFields,
    ...punjabiFields,
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter Email',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.email()]
    },
    {
      name: 'phonelandline',
      label: 'Landline Number',
      type: 'text',
      placeholder: 'Enter Landline Number',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.digitsOnly()]
    },
    {
      name: 'mobilenumber',
      label: 'Mobile Number',
      type: 'text',
      placeholder: 'Enter Mobile Number',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.phone10()]
    },
    {
      name: 'pincode',
      label: 'Pin Code',
      type: 'text',
      placeholder: 'Enter Pin Code',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.digitsOnly()]
    },
    {
      name: 'officelevelcode',
      label: 'Office Level',
      type: 'select',
      placeholder: 'Enter Code',
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'circle_id',
      label: 'Circle',
      type: 'select',
      placeholder: 'Enter Code',
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'division_id',
      label: 'Division',
      type: 'select',
      placeholder: 'Enter Code',
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'subdivision_id',
      label: 'Sub-Division',
      type: 'select',
      placeholder: 'Enter Code',
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'lgdstatecode',
      label: 'State Code',
      type: 'select',
      placeholder: 'Enter Code',
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'lgddistcode',
      label: 'District Code',
      type: 'select',
      placeholder: 'Enter Code',
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
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
};
