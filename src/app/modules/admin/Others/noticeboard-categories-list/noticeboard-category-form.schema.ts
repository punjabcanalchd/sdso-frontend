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
          label: 'EN'
        },
        {
          id: 'general-punjabi',
          label: 'PB'
        }
      ]
    },
    {
      id: 'meta',
      label: 'Meta Information',
      tabs: [
        {
          id: 'meta-english',
          label: 'EN'
        },
        {
          id: 'meta-punjabi',
          label: 'PB'
        }
      ]
    }
  ],
  fields: [
    // ==========================================
    // 1. GENERAL TAB - ENGLISH
    // ==========================================
    {
      name: 'name_en',
      label: 'Name',
      type: 'text',
      tab: 'general-english',
      languageCode: 'en',
      languageId: 1,
      placeholder: '',
      required: true,
      className: 'col-12',
      validators: [CustomValidators.shortAlpha()],
      copyKey: 'name'
    },

    // ==========================================
    // 2. GENERAL TAB - PUNJABI
    // ==========================================
    {
      name: 'same_as_english_pb',
      label: '',
      type: 'checkbox',
      languageCode: 'pb',
      languageId: 2,
      tab: 'general-punjabi',
      text: 'Same as English',
      className: 'col-12'
    },
    {
      name: 'name_pb',
      label: 'Name',
      type: 'text',
      languageCode: 'pb',
      languageId: 2,
      tab: 'general-punjabi',
      placeholder: '',
      required: true,
      className: 'col-12',
      copyKey: 'name'
    },

    // ==========================================
    // 3. META INFORMATION TAB - ENGLISH
    // ==========================================
    {
      name: 'meta_title_en',
      label: 'Meta Title',
      type: 'text',
      tab: 'meta-english',
      languageCode: 'en',
      languageId: 1,
      className: 'col-12'
    },
    {
      name: 'meta_description_en',
      label: 'Meta Description',
      type: 'text',
      tab: 'meta-english',
      languageCode: 'en',
      languageId: 1,
      className: 'col-12'
    },
    {
      name: 'meta_keyword_en',
      label: 'Meta keywords',
      type: 'text',
      tab: 'meta-english',
      languageCode: 'en',
      languageId: 1,
      className: 'col-12'
    },

    // ==========================================
    // 4. META INFORMATION TAB - PUNJABI
    // ==========================================
    {
      name: 'meta_title_pb',
      label: 'Meta Title',
      type: 'text',
      tab: 'meta-punjabi',
      languageCode: 'pb',
      languageId: 2,
      className: 'col-12'
    },
    {
      name: 'meta_description_pb',
      label: 'Meta Description',
      type: 'text',
      tab: 'meta-punjabi',
      languageCode: 'pb',
      languageId: 2,
      className: 'col-12'
    },
    {
      name: 'meta_keyword_pb',
      label: 'Meta keywords',
      type: 'text',
      tab: 'meta-punjabi',
      languageCode: 'pb',
      languageId: 2,
      className: 'col-12'
    },

    // ==========================================
    // 5. COMMON CATEGORY ATTRIBUTES (From Screenshot 2)
    // ==========================================
    // Row 1: Parent Category & External Url
    {
      name: 'parent_id',
      label: 'Parent Category',
      type: 'select',
      tab: 'general-english',
      placeholder: 'Please select',
      className: 'col-md-6',
      options: []
    },
    {
      name: 'external_url',
      label: 'External Url',
      type: 'text',
      tab: 'general-english',
      className: 'col-md-6'
    },

    // Row 2: Status & Display On Notice Board
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      tab: 'general-english',
      placeholder: 'Please select',
      className: 'col-md-6',
      required: true,
      defaultValue: 1,
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    },
    {
      name: 'display_on_home_page',
      label: 'Display On Notice Board',
      type: 'select',
      tab: 'general-english',
      placeholder: 'Please select',
      className: 'col-md-6',
      required: true,
      defaultValue: 1,
      options: [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 }
      ]
    },

    // Row 3: Sort Order & Access Type
    {
      name: 'sort_order',
      label: 'Sort Order',
      type: 'number',
      tab: 'general-english',
      className: 'col-md-6',
      defaultValue: 1
    },
    {
      name: 'access_type',
      label: 'Who can access this Category?',
      type: 'radio',
      tab: 'general-english',
      className: 'col-md-6',
      required: true,
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Officials', value: 'officials' }
      ]
    }
  ]
};
