import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { englishFields } from '../../../../common/tabs/english-tab';
import { punjabiFields } from '../../../../common/tabs/punjabi-tab';

export const CircleSchema: FormSchema = {
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
        type: 'select',
        required: true,
        options: [
          { label: 'Please select state', value: '' },
        ],
        className: 'col-md-4 rounded-0',
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
