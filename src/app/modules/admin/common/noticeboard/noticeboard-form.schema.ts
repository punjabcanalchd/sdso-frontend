import { FormSchema } from '../../../../core/models/form-schema.model';

import { englishFields } from '../../../../common/tabs/english-tab';
import { punjabiFields } from '../../../../common/tabs/punjabi-tab';
import { metaPunjabiFields } from '../../../../common/tabs/meta-punjabi-tab';
import { metaEnglishFields } from '../../../../common/tabs/meta-english-tab';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const noticeboardSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary',


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
    // 1. LOCALIZED TITLE & DESCRIPTION (EN & PB)
    // ==========================================
    ...englishFields, // Contains Title (name_en) & Description TinyMCE (description_en)
    ...punjabiFields, // Contains Title (name_pb) & Description TinyMCE (description_pb) + 'Same as English'

    // ==========================================
    // 2. LOCALIZED META INFORMATION (EN & PB)
    // ==========================================
    ...metaEnglishFields, // Meta Title, Meta Description, Meta Keyword (English)
    ...metaPunjabiFields, // Meta Title, Meta Description, Meta Keyword (Punjabi)

    // ==========================================
    // 3. NOTICE BOARD ATTRIBUTES (From your screenshot)
    // ==========================================

    // Row 1: Category Name & Upload Notice
    {
      type: 'select',
      name: 'category_id',
      label: 'Category Name',
      placeholder: 'Please select',
      className: 'col-md-6',
      required: true,
      options: [
        { label: 'Tenders', value: 1 },
        { label: 'Office Orders', value: 2 },
        { label: 'Circulars', value: 3 },
        { label: 'Public Notices', value: 4 }
      ]
    },
    {
      type: 'file',
      name: 'notice_file',
      label: 'Upload Notice',
      className: 'col-md-6',
      validators: [
        CustomValidators.fileMaxSizeMB(10),
        CustomValidators.fileTypes(['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']),
        CustomValidators.suspiciousFileUpload()
      ]
    },

    // Row 2: Publish Date & Last Submission Date
    {
      type: 'datepicker',
      name: 'publish_date',
      label: 'Publish Date',
      placeholder: 'dd / mm / yyyy',
      className: 'col-md-6',
      required: true
    },
    {
      type: 'datepicker',
      name: 'last_submission_date',
      label: 'Last Submission Date',
      placeholder: 'dd / mm / yyyy',
      className: 'col-md-6'
    },

    // Row 3: Status & Language
    {
      type: 'select',
      name: 'status',
      label: 'Status',
      placeholder: 'Please select',
      className: 'col-md-6',
      required: true,
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    },
    {
      type: 'select',
      name: 'language_id',
      label: 'Language',
      placeholder: 'Please select',
      className: 'col-md-6',
      options: [
        { label: 'English', value: 1 },
        { label: 'Punjabi', value: 2 },
        { label: 'Bilingual', value: 3 }
      ]
    },

    // Row 4: Radio Options
    {
      type: 'radio',
      name: 'is_latest_news',
      label: 'Do you want to publish in "Latest News"?',
      className: 'col-md-6',
      required: true,
      defaultValue: false,
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ]
    },
    {
      type: 'radio',
      name: 'access_type',
      label: 'Who can access this Notification?',
      className: 'col-md-6',
      required: true,
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Officials', value: 'officials' }
      ]
    },

    // Row 5: Designation Filter
    {
      type: 'select',
      name: 'designation_id',
      label: 'Designation Filter',
      placeholder: 'Please select',
      className: 'col-md-6',
      options: [
        { label: 'Chief Engineer', value: 1 },
        { label: 'Superintending Engineer', value: 2 },
        { label: 'Executive Engineer', value: 3 },
        { label: 'Sub Divisional Officer', value: 4 }
      ]
    }
  ]
};
