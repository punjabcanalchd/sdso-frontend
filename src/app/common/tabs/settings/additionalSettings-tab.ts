import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const additionalSettingsFields: FormField[] = [
  // Latest News Colors
  {
    type: 'text',
    // type: 'color',
    name: 'latest_news_bg_color',
    label: 'Latest News Background Color',
    required: true,
    placeholder: 'Select background color',
    className: 'col-md-4',
    tab: 'additionalSettingssection',
  },
  {
    // type: 'color',
    type: 'text',
    name: 'latest_news_text_color',
    label: 'Latest News Text Color',
    required: true,
    placeholder: 'Select text color',
    className: 'col-md-4',
    tab: 'additionalSettingssection',
  },

  // File Upload Size Status
  {
    type: 'toggle',
    name: 'file_upload_size_status',
    label: 'File Upload Size Status',
    required: true,
    className: 'col-md-4',
    tab: 'additionalSettingssection',
  }
];