import { FormField } from '../../core/models/form-schema.model';
import { CustomValidators } from '../validation/custom-validators';


export const metaEnglishFields: FormField[] = [

  {
    name: 'header_meta_en',
    tab: 'meta-english',
    label: '',
    type: 'html',
    html: '<div class="font_color fw-bold text-uppercase small">Meta Information</div>',
  },

  {
    type: 'text',
    name: 'meta_title_en',
    label: 'Meta Title',
    tab: 'meta-english',
    className: 'col-md-4',
  },

  {
    type: 'text',
    name: 'meta_description_en',
    label: 'Meta Description',
    tab: 'meta-english',
    className: 'col-md-4',
  },

  {
    type: 'text',
    name: 'meta_keyword_en',
    label: 'Meta Keyword',
    tab: 'meta-english',
    className: 'col-md-4',
  },

];