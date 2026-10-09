import { FormSchema } from '../../../core/models/form-schema.model';
import { generalFields } from '../../../common/tabs/settings/general-tab';
import { layoutFields } from './../../../common/tabs/settings/layout-tab';
import { footerFields } from './../../../common/tabs/settings/footer-tab';
import { logoFields } from './../../../common/tabs/settings/logo-tab';
import { manageSectionFields } from './../../../common/tabs/settings/managesection-tab';
import { contactUsFields } from './../../../common/tabs/settings/contactUs-tab';
import { metaInformationFields } from './../../../common/tabs/settings/metaInformation-tab';
import { additionalSettingsFields } from './../../../common/tabs/settings/additionalSettings-tab';
import { CustomValidators } from '../../../common/validation/custom-validators';

export const settingSchema: FormSchema = {
//   layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary',
  saveByTab: true,


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
    },
     {
        id:'logosection',
        label:'Logo'
    },
     {
        id:'contactUssection',
        label:'Contact Us'
    },
     {
        id:'metaInformationsection',
        label:'Meta Informations'
    },
     {
        id:'additionalSettingssection',
        label:'Additional Settings'
    },

   
  ],

  fields: [    
    ...generalFields, 
    ...layoutFields,
    ...footerFields,
    ...manageSectionFields,
    ...logoFields,
    ...contactUsFields,
    ...metaInformationFields,
    ...additionalSettingsFields,   
  ]
};
