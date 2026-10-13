import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const additionalSettingsFields: FormField[] = [ 
  {    
    type: 'color',
    name: 'ln_bg_color',
    label: 'Latest News Background Color',
    required: true,
    className: 'col-md-6',
    tab: 'additionalSettingssection',
  },
  {
    type: 'color',  
    name: 'ln_txt_color',
    label: 'Latest News Text Color',
    required: true,    
    className: 'col-md-6',
    tab: 'additionalSettingssection',
  },
  // File Upload Size Status
  {
    type: 'toggle',
    name: 'file_size_status',
    label: 'File Upload Size Status',
    required: true,
    className: 'col-md-4',
    tab: 'additionalSettingssection',
  }
];