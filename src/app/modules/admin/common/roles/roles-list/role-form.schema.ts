import { FormSchema } from '../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../common/validation/custom-validators';

export const roleSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Create Role',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary',

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
      name: 'search',
      label: 'Search Permissions',
      icon: 'bi bi-search',
      type: 'text',
      placeholder: 'Search Permissions',
      className: 'col-md-5',
      inputClass: 'ps-5'
    },
    {
      name: 'selectAll',
      label: 'Select All',
      type: 'checkbox',
      className: 'col-md-2'
    },
    {
      name: 'permissions',
      label: 'Permissions',
      type: 'custom-permission',
      className: 'col-12'
    }
  ]
};
