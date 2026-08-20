import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { englishFields } from '../../../../common/tabs/english-tab';
import { punjabiFields } from '../../../../common/tabs/punjabi-tab';

export const DesignationSchema: FormSchema = {
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
      name: 'desigsenioritylevel',
      label: 'Designation Level',
      type: 'number',
      required: true,
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
};
