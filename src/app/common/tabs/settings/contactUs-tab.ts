import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const contactUsFields: FormField[] = [

{
      type: 'text',
      name: 'contact_title_en',
      label: 'Title English',
      required: false,
      placeholder: 'Enter title in English',
      className: 'col-md-4',
      tab: 'contactUssection',
    },
    {
      type: 'text',
      name: 'contact_title_pb',
      label: 'Title Punjabi',
      required: false,
      placeholder: 'Enter title in Punjabi',
       className: 'col-md-4',
      tab: 'contactUssection',
    },
    {
      type: 'text',
      name: 'contact_phone',
      label: 'Phone Number',
      required: false,
      placeholder: 'Enter phone number',
       className: 'col-md-4',
      tab: 'contactUssection',
    },

    // Address
    {
      type: 'textarea',
      name: 'contact_address_en',
      label: 'Address English',
      required: false,
      placeholder: 'Enter address in English',
       className: 'col-md-4',
      tab: 'contactUssection',
    },
    {
      type: 'textarea',
      name: 'contact_address_pb',
      label: 'Address Punjabi',
      required: false,
      placeholder: 'Enter address in Punjabi',
       className: 'col-md-4',
      tab: 'contactUssection',
    },

    // Map configuration
    {
      type: 'text',
      name: 'map_token',
      label: 'Token Key (map)',
      required: false,
      placeholder: 'Enter map token key',
       className: 'col-md-4',
      tab: 'contactUssection',
    },
    {
      type: 'text',
      name: 'map_url',
      label: 'Map URL',
      required: false,
      placeholder: 'https://example.com',
       className: 'col-md-4',
      tab: 'contactUssection',
    },
    {
      type: 'password',
      name: 'map_api_key',
      label: 'Map API key',
      required: false,
      placeholder: 'Enter map API key',
       className: 'col-md-4',
      tab: 'contactUssection',
    },

    // Block service configuration
    {
      type: 'text',
      name: 'block_service_url',
      label: 'Block Service URL',
      required: false,
      placeholder: 'https://example.com',
       className: 'col-md-4',
      tab: 'contactUssection',
    },
    {
      type: 'password',
      name: 'block_service_token',
      label: 'Block Service Token',
      required: false,
      placeholder: 'Enter block service token',
       className: 'col-md-4',
      tab: 'contactUssection',
    },

    // Coordinates
    {
      type: 'number',
      name: 'latitude',
      label: 'Latitude',
      required: false,
      placeholder: 'Enter latitude',
       className: 'col-md-4',
      tab: 'contactUssection',
    },
    {
      type: 'number',
      name: 'longitude',
      label: 'Longitude',
      required: false,
      placeholder: 'Enter longitude',
       className: 'col-md-4',
      tab: 'contactUssection',
    },
];