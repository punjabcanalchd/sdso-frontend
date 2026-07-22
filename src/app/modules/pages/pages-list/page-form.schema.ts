import { FormSchema } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../../common/validation/custom-validators';

export const pageSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Create Page',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary',


  fields: [
  {
    name: 'header_en',
    label: '',
    type: 'html',
    html: '<div class="font_color fw-bold text-uppercase small">English Details</div>',
    // className: 'col-md-6 border-end border-light-subtle pe-4 mt-0 pt-3'
  },

  //  English Title 
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter Title',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.shortAlpha()]
    },
   
    {
      type: 'editor',
      name: 'description',
      label: 'Description',
      required: true,
    },
    {
    name: 'header_en',
    label: '',
    type: 'html',
    html: '<div class="font_color fw-bold text-uppercase small">Meta Information </div>',
    // className: 'col-md-3 ps-4 mt-0 pt-3'
    },
    {
      type: 'text',
      name:  'meta_title_en',
      label: 'Meta Title',
      className: 'col-md-4',
  
    },
     {
      type: 'text',
      name:  'meta_description_en',
      label: 'Meta Description',
      className: 'col-md-4',   
    },
    {
      type: 'text',
      name:  'meta_keyword_en',
      label: 'Meta Keyword',
      className: 'col-md-4',   
    },
    {
      name: 'header_pb',
      label: '',
      type: 'html',
      html: '<div class="font_color fw-bold text-uppercase small">Punjabi Details</div>',
      // className: 'col-md-3 ps-4 mt-0 pt-3'
    },
    {
      name: 'same_as_english',
      label: '',
      text: 'Same as English',
      type: 'checkbox',
      // className: 'col-md-3 mt-0 pt-2 d-flex justify-content-end' // Takes the last 25% of the row!
    },

    // Punjabi Details
    
     {
      name: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter Title',
      required: true,
      className: 'col-md-4',
      validators: [CustomValidators.shortAlpha()]
    },   
    {
      type: 'editor',
      name: 'description',
      label: 'Description',
      required: true,
    },
     {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      className: 'col-md-4',
    },
    {
      type: 'select',
      name: 'status',
      label: 'Status',
      className: 'col-md-4',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'In active', value: 'inactive' }
      ]
    },
    {
      type: 'number',
      name: 'pageOrder',
      label: 'Page Order',
      className: 'col-md-4',
    },
    {
      type: 'select',
      name: 'pageType',
      label: 'Page Type',
      className: 'col-md-4',
      options: [
        { label: 'Normal page', value: 'normal' }
        // Add additional options as needed
      ]
    },
    {
      type: 'text',
      name: 'externalUrl',
      label: 'External Url',
      className: 'col-md-4',
    },
    {
      type: 'select',
      name: 'formTemplates',
      label: 'Form Templates',
      className: 'col-md-4',
      options: [
        { label: 'Select Form Template', value: '' }
      ]
    },
    {
      type: 'file',
      name: 'pageBanner',
      label: 'Default Page Banner (1366p x 350p)',       
    },
    {
    name: 'header_pb',
    label: '',
    type: 'html',
    html: '<div class="font_color fw-bold text-uppercase small">Meta Information </div>',
    // className: 'col-md-3 ps-4 mt-0 pt-3'
    },
    {
      type: 'text',
      name:  'meta_title_pb',
      label: 'Meta Title',
      className: 'col-md-4',
  
    },
     {
      type: 'text',
      name:  'meta_description_pb',
      label: 'Meta Description',
      className: 'col-md-4',   
    },
    {
      type: 'text',
      name:  'meta_keyword_pb',
      label: 'Meta Keyword',
      className: 'col-md-4',   
    },

  
]
}
