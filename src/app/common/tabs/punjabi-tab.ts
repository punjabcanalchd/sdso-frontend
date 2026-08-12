import { FormField } from '../../core/models/form-schema.model';

export const punjabiFields: FormField[] = [
  {
    name: 'same_as_english_pb',
    label: '',
    type: 'checkbox',
    tab: 'general-punjabi',
    text: 'Same as English'
  },

  {
    name: 'title_pb',
    label: 'Title',
    type: 'text',
    tab: 'general-punjabi',
    placeholder: 'Enter Title'
  },
  {
    name: 'description_pb',
    label: 'Description',
    type: 'editor',
    tab: 'general-punjabi',
  },
 
];