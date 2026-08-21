import { FormField } from '../../core/models/form-schema.model';

export const punjabiFields: FormField[] = [
  {
    name: 'same_as_english_pb',
    label: '',
    type: 'checkbox',
    languageCode: 'pb',
    languageId: 2,
    tab: 'general-punjabi',
    text: 'Same as English',    
  },

  {
    name: 'name_pb',
    label: 'Title',
    type: 'text',
    languageCode: 'pb',
    languageId: 2,
    tab: 'general-punjabi',
    placeholder: 'Enter Title',
    required: true,
    copyKey: 'name'
  },
  {
    name: 'description_pb',
    label: 'Description',
    type: 'editor',
    languageId:2,
    languageCode: 'pb',
    tab: 'general-punjabi',
    required: true,
    copyKey: 'description'
  },
 
];