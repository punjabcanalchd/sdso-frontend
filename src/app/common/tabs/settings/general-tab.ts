import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const generalFields: FormField[] = [
    {
      type: 'text',
      name: 'website_name',
      label: 'Website Name',      
      placeholder: 'Enter website name',
      className: 'col-md-4',
      tab: 'general',
      required: true,
        // validators: [
        //   Validators.minLength(6),
        //   Validators.maxLength(6)
        // ],
    },
    {
      type: 'text',
      name: 'website_url',
      label: 'Website Url',
      tab: 'general',
      placeholder: 'https://example.com',
      required: true,
       className: 'col-md-4',
    }, 
    {
      type: 'select',
      name: 'website_status',
      label: 'Website Status',
      className: 'col-md-4',
      tab: 'general',
      required: true,
      options: [
        { value: 'live', label: 'Live' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'offline', label: 'Offline' }
      ]
    },
    {
      type: 'email',
      name: 'contact_support_email',
      label: 'Contact Support Email',
      placeholder: 'Enter support email',
       className: 'col-md-4',
       tab: 'general',
      required: true
    },
    {
      type: 'file',
      name: 'site_icon',
      label: 'Site icon',
      className: 'col-md-4',
      tab: 'general',
    //   accept: '.ico,.png,.jpg,.jpeg,.webp'
    },
    {
      type: 'select',
      name: 'default_language',
      label: 'Default language',
      tab: 'general',
      required: true,
      className: 'col-md-4',
      options: [
        { value: 'EN', label: 'EN' },
        { value: 'PA', label: 'PA' }
      ]
    },
    {
      type: 'text',
      name: 'facebook',
      label: 'FaceBook',
      tab: 'general',
      placeholder: 'https://www.facebook.com/',
       className: 'col-md-4',
    },
    {
      type: 'text',
      name: 'twitter',
      label: 'Twitter',
      tab: 'general',
      placeholder: 'https://twitter.com/',
       className: 'col-md-4',
    },
    {
      type: 'text',
      name: 'youtube',
      label: 'YouTube',
      tab: 'general',
      className: 'col-md-4',
      placeholder: 'https://www.youtube.com/'
    },
    {
      type: 'text',
      name: 'instagram',
      label: 'Instagram',
       className: 'col-md-4',
       tab: 'general',
      placeholder: 'https://www.instagram.com/'
    },
    {
      type: 'text',
      name: 'linkedin',
      label: 'LinkedIn',
       className: 'col-md-4',
       tab: 'general',
      placeholder: 'https://www.linkedin.com/'
    },
    {
      type: 'textarea',
      name: 'twitter_section_widget',
      label: 'Twitter Section Widget',
       className: 'col-md-4',
       tab: 'general',
      placeholder: 'Enter Twitter/X widget code or URL',
    //   rows: 3
    },
    {
      type: 'number',
      name: 'records_per_page',
      label: 'Records Per Page(Pagination)',
      placeholder: '30',
      tab: 'general',
      required: true,
       className: 'col-md-4',
      min: 1
    },
    {
      type: 'select',
      name: 'captcha_validation',
      label: 'Captcha Validation',
      required: true,
      tab: 'general',
      className: 'col-md-4',
      options: [
        { value: 'enabled', label: 'Enabled' },
        { value: 'disabled', label: 'Disabled' }
      ]
    },
    {
      type: 'number',
      name: 'adjust_file_size',
      tab: 'general',
      label: 'Adjust File Size (in KB)',
      placeholder: 'Enter file size in KB',
      className: 'col-md-4',
      min: 1
    }


];