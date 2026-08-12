import { FormSchema } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../../common/validation/custom-validators';


import { englishFields } from '../../../common/tabs/english-tab';
import { punjabiFields } from '../../../common/tabs/punjabi-tab';

export const pageSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Create Page',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary',


  tabs: [
    {
      id: 'english',
      label: 'English Details'
    },
    {
      id: 'punjabi',
      label: 'Punjabi Details'
    }
  ],


  fields: [
    ...englishFields,
    ...punjabiFields,

     {
    name: 'header_page',
    label: '',
    type: 'html',
    html: '<div class="font_color fw-bold text-uppercase small">Page Settings </div>',
    // className: 'col-md-3 ps-4 mt-0 pt-3'
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
   

  
]
}
