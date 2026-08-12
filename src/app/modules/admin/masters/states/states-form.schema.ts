import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { englishFields } from '../../../../common/tabs/english-tab';
import { punjabiFields } from '../../../../common/tabs/punjabi-tab';
import { metaPunjabiFields } from '../../../../common/tabs/meta-punjabi-tab';
import { metaEnglishFields } from '../../../../common/tabs/meta-english-tab';

export const stateSchema: FormSchema = {
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
      name: 'lgdstatecode',
      label: 'State Code',
      type: 'number',
      required: true,
      placeholder: 'Enter State Code',
      className: 'col-md-6',
      validators: [CustomValidators.digitsOnly()]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'toggle',
      required: true,
      className: 'col-md-6',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' }
      ]
    },
  ]
};
