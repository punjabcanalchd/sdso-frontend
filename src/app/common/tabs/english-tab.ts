import { FormField } from '../../core/models/form-schema.model';
import { CustomValidators } from '../validation/custom-validators';

export const englishFields: FormField[] = [
  {
    name: 'name_en',
    label: 'Title',
    type: 'text',
    tab: 'general-english',
    languageCode: 'en',
    languageId: 1,
    placeholder: 'Enter Title',
    required: true,  
    validators: [
      CustomValidators.shortAlpha()
    ],
    copyKey: 'name'
  },

  {
    name: 'description_en',
    label: 'Description',
    type: 'editor',
    languageId: 1,
    tab: 'general-english',
    required: true,
    copyKey: 'description'
  }
];

