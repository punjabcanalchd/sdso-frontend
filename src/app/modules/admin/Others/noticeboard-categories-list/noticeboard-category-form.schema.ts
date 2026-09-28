import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const noticeboardCategorySchema: FormSchema = {
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
    }
  ],
  fields: [
    {
      name: 'name_en',
      label: 'Category Name',
      type: 'text',
      tab: 'general-english',
      languageCode: 'en',
      languageId: 1,
      placeholder: 'Enter Category Name in English',
      required: true,
      validators: [CustomValidators.shortAlpha()],
      copyKey: 'name'
    },
    {
      name: 'same_as_english_pb',
      label: '',
      type: 'checkbox',
      languageCode: 'pb',
      languageId: 2,
      tab: 'general-punjabi',
      text: 'Same as English'
    },
    {
      name: 'name_pb',
      label: 'Category Name',
      type: 'text',
      languageCode: 'pb',
      languageId: 2,
      tab: 'general-punjabi',
      placeholder: 'Enter Category Name in Punjabi',
      required: true,
      copyKey: 'name'
    },
    {
      name: 'display_on_home_page',
      label: 'Display on Home Page',
      type: 'toggle',
      className: 'col-md-6',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'toggle',
      className: 'col-md-6',
      options: [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
      ]
    }
  ]
};
