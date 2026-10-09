import { FormSchema } from '../../../../core/models/form-schema.model';

export const smsTemplateSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Create SMS Template',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn btn-primary',
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
    // 1. ENGLISH TAB FIELDS
    // ==========================================
    {
      name: 'message_en',
      label: 'SMS Message',
      type: 'textarea',
      tab: 'en',
      languageCode: 'en',
      languageId: 1,
      copyKey: 'message',
      required: true,
      className: 'col-12',
      placeholder: 'Enter SMS message content (e.g. {#var#} is your OTP...)'
    },

    // ==========================================
    // 2. PUNJABI TAB FIELDS
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
      name: 'message_pb',
      label: 'SMS Message',
      type: 'textarea',
      tab: 'pb',
      languageCode: 'pb',
      languageId: 2,
      copyKey: 'message',
      required: false,
      className: 'col-12',
      placeholder: 'Enter Punjabi SMS message content...'
    },

    // ==========================================
    // 3. COMMON ATTRIBUTES (Displayed below tabs)
    // ==========================================
    {
      name: 'name',
      label: 'Template Name',
      type: 'text',
      required: true,
      className: 'col-md-6',
      placeholder: 'Enter template name'
    },
    {
      name: 'templateid',
      label: 'DLT Template ID',
      type: 'text',
      required: true,
      className: 'col-md-6',
      placeholder: 'e.g. 1407165900230697564'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 1,
      className: 'col-md-6',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    }
  ]
};
