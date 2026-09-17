import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { englishFields } from '../../../../common/tabs/english-tab';
import { punjabiFields } from '../../../../common/tabs/punjabi-tab';

export const DamHeadWorksSchema: FormSchema = {
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
      name: 'startlat',
      label: 'Start Latitude',
      type: 'text',
      placeholder: 'Enter Latitude',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.latitude()]
    },
    {
      name: 'startlong',
      label: 'Start Longitude',
      type: 'text',
      placeholder: 'Enter Longitude',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.longitude()]
    },
    {
      name: 'lgdstatecode',
      label: 'Select State',
      type: 'select',
      placeholder: 'Select...',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'lgddistcode',
      label: 'Select District',
      type: 'select',
      placeholder: 'Select...',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'officecode',
      label: 'Office',
      type: 'select',
      placeholder: 'Select...',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.textContent()]
    },
    {
      name: 'entitycode',
      label: 'Entity Type',
      type: 'select',
      placeholder: 'Select...',
      className: 'col-md-4',
      required: true,
      options: [
        { label: 'DAM', value: 'DAM' },
        { label: 'HeadWorks', value: 'HeadWorks' }
      ],
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
