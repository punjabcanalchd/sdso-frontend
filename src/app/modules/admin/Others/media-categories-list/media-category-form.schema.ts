import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const mediaCategorySchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn btn-primary-govt',
  tabs: [
    {
      id: 'en',
      label: 'EN'
    },
    {
      id: 'pb',
      label: 'PB'
    }
  ],
  fields: [
    // ==========================================
    // 1. ENGLISH TAB FIELDS (First)
    // ==========================================
    {
      name: 'name_en',
      label: 'Title',
      type: 'text',
      tab: 'en',
      languageCode: 'en',
      languageId: 1,
      placeholder: '',
      required: true,
      className: 'col-12',
      validators: [CustomValidators.shortAlpha()],
      copyKey: 'name'
    },
    {
      name: 'description_en',
      label: 'Description',
      type: 'editor',
      tab: 'en',
      languageCode: 'en',
      languageId: 1,
      className: 'col-12',
      copyKey: 'description'
    },

    // ==========================================
    // 2. PUNJABI TAB FIELDS (Second, with Same as English)
    // ==========================================
    {
      name: 'same_as_english_pb',
      label: '',
      type: 'checkbox',
      languageCode: 'pb',
      languageId: 2,
      tab: 'pb',
      text: 'Same as English',
      className: 'col-12'
    },
    {
      name: 'name_pb',
      label: 'Title',
      type: 'text',
      tab: 'pb',
      languageCode: 'pb',
      languageId: 2,
      placeholder: '',
      required: true,
      className: 'col-12',
      copyKey: 'name'
    },
    {
      name: 'description_pb',
      label: 'Description',
      type: 'editor',
      tab: 'pb',
      languageCode: 'pb',
      languageId: 2,
      className: 'col-12',
      copyKey: 'description'
    },

    // ==========================================
    // 3. COMMON ATTRIBUTES (Displayed below tabs)
    // ==========================================
    // Row 1: Display On Home Page & Status
    {
      name: 'display_on_home_page',
      label: 'Display On Home Page',
      type: 'select',
      placeholder: 'Please select',
      className: 'col-md-6',
      required: true,
      defaultValue: 1,
      options: [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Please select',
      className: 'col-md-6',
      required: true,
      defaultValue: 1,
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    },

    // Row 2: Category Image & Parent Category
    {
      name: 'category_image',
      label: 'Category Image',
      type: 'file',
      placeholder: 'Choose File',
      className: 'col-md-6',
      required: true,
      validators: [
        CustomValidators.fileMaxSizeMB(5),
        CustomValidators.fileTypes(['jpg', 'jpeg', 'png', 'webp']),
        CustomValidators.suspiciousFileUpload()
      ]
    },
    {
      name: 'parent_id',
      label: 'Parent Category',
      type: 'select',
      placeholder: 'Please select',
      className: 'col-md-6',
      options: [
        { label: 'Please select', value: '' }
      ]
    }
  ]
};
