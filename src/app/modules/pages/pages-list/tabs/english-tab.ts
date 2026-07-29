import { FormField } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const englishFields: FormField[] = [

  // {
  //   name: 'header_en',
  //   label: '',
  //   type: 'html',
    
  //   html: '<div class="font_color fw-bold text-uppercase small">English Details</div>',
  //   tab: 'english'
  // },

  {
    name: 'title_en',
    label: 'Title',
    type: 'text',
    tab: 'english',
    placeholder: 'Enter Title',
    required: true,
    className: 'col-md-4',
    validators: [
      CustomValidators.shortAlpha()
    ]
  },

  {
    name: 'description_en',
    label: 'Description',
    type: 'editor',
    tab: 'english',
    required: true
  },

   {
    name: 'header_meta_en',
    tab: 'english',
    label: '',
    type: 'html',
    html: '<div class="font_color fw-bold text-uppercase small">Meta Information </div>',
    // className: 'col-md-3 ps-4 mt-0 pt-3'
    },
    {
      type: 'text',
      name:  'meta_title_en',
      label: 'Meta Title',
      tab: 'english',
      className: 'col-md-4',
  
    },
     {
      type: 'text',
      tab: 'english',
      name:  'meta_description_en',
      label: 'Meta Description',
      className: 'col-md-4',   
    },
    {
      type: 'text',
      tab: 'english',
      name:  'meta_keyword_en',
      label: 'Meta Keyword',
      className: 'col-md-4',   
    },

];