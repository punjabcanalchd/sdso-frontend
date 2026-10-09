import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const metaInformationFields: FormField[] = [
  // Meta Title
  {
    type: 'text',
    name: 'meta_title_en',
    label: 'Meta Title English',
    required: false,
    placeholder: 'Enter meta title in English',
     className: 'col-md-4',
      tab: 'metaInformationsection',
  },
  {
    type: 'text',
    name: 'meta_title_pb',
    label: 'Meta Title Punjabi',
    required: false,
    placeholder: 'Enter meta title in Punjabi',
     className: 'col-md-4',
      tab: 'metaInformationsection',
  },

  // Meta Description
  {
    type: 'textarea',
    name: 'meta_description_en',
    label: 'Meta Description English',
    required: false,
    placeholder: 'Enter meta description in English',
    className: 'col-md-4',
    tab: 'metaInformationsection',
  },
  {
    type: 'textarea',
    name: 'meta_description_pb',
    label: 'Meta Description Punjabi',
    required: false,
    placeholder: 'Enter meta description in Punjabi',
    className: 'col-md-4',
    tab: 'metaInformationsection',
  },

  // Meta Keywords
  {
    type: 'textarea',
    name: 'meta_keyword_en',
    label: 'Meta Keywords English',
    required: false,
    placeholder: 'Enter meta keywords in English',
    className: 'col-md-4',
    tab: 'metaInformationsection',
  },
  {
    type: 'textarea',
    name: 'meta_keyword_pb',
    label: 'Meta Keywords Punjabi',
    required: false,
    placeholder: 'Enter meta keywords in Punjabi',
    className: 'col-md-4',
    tab: 'metaInformationsection',
    
  },
];