import { FormSchema } from '../../../../core/models/form-schema.model';

export const translationSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Create Translation',
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
      name: 'en',
      label: 'Translation',
      type: 'textarea',
      tab: 'en',
      languageCode: 'en',
      languageId: 1,
      required: true,
      className: 'col-12',
      placeholder: 'Enter English translation'
    },
    {
      name: 'group',
      label: 'Group',
      type: 'select',
      tab: 'en',
      required: true,
      className: 'col-md-6',
      copyKey: 'group',
      placeholder: 'Select Group',
      options: [
        { label: 'General', value: 1 },
        { label: 'Homepage', value: 2 },
        { label: 'Errors', value: 3 }
      ]
    },
    {
      name: 'translation_key',
      label: 'Unique Key',
      type: 'text',
      tab: 'en',
      required: true,
      className: 'col-md-6',
      copyKey: 'translation_key',
      placeholder: 'e.g. key_home, label_submit'
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
      defaultValue: true,
      text: 'Same as English',
      className: 'col-12'
    },
    {
      name: 'pb',
      label: 'Translation',
      type: 'textarea',
      tab: 'pb',
      languageCode: 'pb',
      languageId: 2,
      required: false,
      className: 'col-12',
      placeholder: 'Enter Punjabi translation'
    },
    {
      name: 'group_pb',
      label: 'Group',
      type: 'select',
      tab: 'pb',
      disabled: true,
      className: 'col-md-6',
      copyKey: 'group',
      placeholder: 'Select Group',
      options: [
        { label: 'General', value: 1 },
        { label: 'Homepage', value: 2 },
        { label: 'Errors', value: 3 }
      ]
    },
    {
      name: 'translation_key_pb',
      label: 'Unique Key',
      type: 'text',
      tab: 'pb',
      disabled: true,
      readonly: true,
      className: 'col-md-6',
      copyKey: 'translation_key',
      placeholder: 'e.g. key_home, label_submit'
    }
  ]
};

