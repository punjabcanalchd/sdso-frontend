import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const DamHeadWorksReadingsSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn btn-primary-govt',
  fields: [
    {
      name: 'damhwcode',
      label: 'Dam/ Headworks Name',
      type: 'select',
      placeholder: 'Select...',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'inflow',
      label: 'Water Inflow (in cucecs) ',
      type: 'number',
      placeholder: 'Enter Inflow',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.decimal2()]
    },
    {
      name: 'outflow',
      label: 'Water Outflow (in cucecs) ',
      type: 'number',
      placeholder: 'Enter Outflow',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.decimal2()]
    },
    {
      name: 'waterlevel',
      label: 'Water Level (in feet) ',
      type: 'number',
      placeholder: 'Enter Water Level',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.decimal2()]
    },
    {
      name: 'readingdate',
      label: 'Reading Date',
      type: 'datepicker',
      placeholder: 'Select Date',
      minDate: new Date().toISOString().split('T')[0],
      maxDate: new Date().toISOString().split('T')[0],
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.validDateTime()]
    },
    {
      type: 'time',
      name: 'start_time',
      label: 'Reading Time',
      required: true,
      className: 'col-md-4',

    },
  ]
};
