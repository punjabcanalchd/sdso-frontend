import { FormField } from '../../core/models/form-schema.model';
import { CustomValidators } from '../validation/custom-validators';

export const englishFields: FormField[] = [
  {
    name: 'name_en',
    label: 'Title',
    type: 'text',
    tab: 'general-english',
    placeholder: 'Enter Title',
    required: true,  
    validators: [
      CustomValidators.shortAlpha()
    ]
  },

  {
    name: 'description_en',
    label: 'Description',
    type: 'editor',
    tab: 'general-english',
    required: true
  }
];