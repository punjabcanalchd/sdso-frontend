import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const OfficeSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn btn-primary-govt',
  steps: [
    {
      title: 'Office',
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
          name: 'officeaddress',
          label: 'Office Address',
          type: 'textarea',
          placeholder: 'Enter Office Address',
          className: 'col-md-4',
          validators: [CustomValidators.textContent()]
        },
        {
          name: 'circle_id',
          label: 'Circle',
          type: 'select',
          placeholder: 'Enter Code',
          className: 'col-md-4',
          validators: [CustomValidators.digitsOnly()]
        },
        {
          name: 'division_id',
          label: 'Division',
          type: 'select',
          placeholder: 'Enter Code',
          className: 'col-md-4',
          validators: [CustomValidators.digitsOnly()]
        },
        {
          name: 'subdivision_id',
          label: 'Sub-Division',
          type: 'select',
          placeholder: 'Enter Code',
          className: 'col-md-4',
          validators: [CustomValidators.digitsOnly()]
        },
        {
          name: 'lgdstatecode',
          label: 'State Code',
          type: 'select',
          placeholder: 'Enter Code',
          className: 'col-md-4',
          validators: [CustomValidators.digitsOnly()]
        },
        {
          name: 'lgddistcode',
          label: 'District Code',
          type: 'select',
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
