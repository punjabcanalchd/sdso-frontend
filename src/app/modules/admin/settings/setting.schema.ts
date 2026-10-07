import { FormSchema } from '../../../core/models/form-schema.model';
import { generalFields } from '../../../common/tabs/settings/general-tab';
import { layoutFields } from './../../../common/tabs/settings/layout-tab';
import { footerFields } from './../../../common/tabs/settings/footer-tab';
import { manageSectionFields } from './../../../common/tabs/settings/managesection-tab';


import { CustomValidators } from '../../../common/validation/custom-validators';

export const settingSchema: FormSchema = {
//   layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary',


  tabs: [
    {
      id: 'general',
      label: 'General',        
    },
    {
      id: 'layout',
      label: 'Layout',        
    },
     {
      id: 'footer',
      label: 'Footer',        
    },
    {
        id:'managesection',
        label:'Manage Section'
    }

   
  ],

  fields: [
    
    ...generalFields, 
    ...layoutFields,
    ...footerFields,
    ...manageSectionFields,
   
  ]
};
