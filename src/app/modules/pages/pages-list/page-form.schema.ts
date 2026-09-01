import { FormSchema } from '../../../core/models/form-schema.model';

import { englishFields } from '../../../common/tabs/english-tab';
import { punjabiFields } from '../../../common/tabs/punjabi-tab';
import { metaPunjabiFields } from '../../../common/tabs/meta-punjabi-tab';
import { metaEnglishFields } from '../../../common/tabs/meta-english-tab';

export const pageSchema: FormSchema = {

  layoutStyle: 'popup',

  submitLabel: 'Create Page',

  submitIcon: 'bi bi-floppy',

  submitClass: 'btn-primary',


  tabs: [

    // ==========================================
    // GENERAL
    // ==========================================

    {
      id: 'general',
      label: 'General',

      tabs: [
        {
          id: 'general-english',
          label: 'English'
        },

        {
          id: 'general-punjabi',
          label: 'Punjabi'
        }
      ]
    },


    // ==========================================
    // META INFORMATION
    // ==========================================

    {
      id: 'meta',
      label: 'Meta Information',

      tabs: [
        {
          id: 'meta-english',
          label: 'English'
        },

        {
          id: 'meta-punjabi',
          label: 'Punjabi'
        }
      ]
    }

  ],


  fields: [

    // ==========================================
    // GENERAL ENGLISH / PUNJABI FIELDS
    // ==========================================

    ...englishFields,

    ...punjabiFields,    

    // ==========================================
    // META FIELDS
    // ==========================================


    ...metaEnglishFields,

    ...metaPunjabiFields,

    // ==========================================
    // PAGE SETTINGS
    // ==========================================

    {
      name: 'header_page',
      label: '',
      type: 'html',      
      html: '<div class="font_color fw-bold text-uppercase small">Page Settings</div>'
    },

    {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      className: 'col-md-4'
    },

    {
      type: 'select',
      name: 'status',
      label: 'Status',
      className: 'col-md-4',

      options: [
        {
          label: 'Active',
          value: true // or 1 depending on backend return
        },
        {
          label: 'Inactive',
          value: false // or 0
        }
      ]
    },

    {
      type: 'number',
      name: 'sort_order',
      label: 'Page Order',
      className: 'col-md-4'
    },

     {
      type: 'file',
      name: 'page_banner',
      label: 'Default Page Banner (1366p x 350p)',    

    },

    
  ]
 
};