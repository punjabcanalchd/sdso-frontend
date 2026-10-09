import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const logoFields: FormField[] = [
     {
      type: 'file',
      name: 'logo_english',
      label: 'Logo English',
      required: false,
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'file',
      name: 'logo_punjabi',
      label: 'Logo Punjabi',
      required: false,
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'file',
      name: 'secondary_logo_english',
      label: 'Secondary Logo English',
      required: false,
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'file',
      name: 'secondary_logo_punjabi',
      label: 'Secondary Logo Punjabi',
      required: false,
      className: 'col-md-6',
      tab: 'logosection',
    },

    // Logo headings
    {
      type: 'text',
      name: 'logo_heading_en',
      label: 'Logo Heading (en)',
      required: false,
      placeholder: 'Enter logo heading in English',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'logo_heading_pb',
      label: 'Logo Heading (pb)',
      required: false,
      placeholder: 'Enter logo heading in Punjabi',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'logo_sub_heading_en',
      label: 'Logo Sub Heading (en)',
      required: false,
      placeholder: 'Enter logo sub heading in English',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'logo_sub_heading_pb',
      label: 'Logo Sub Heading (pb)',
      required: false,
      placeholder: 'Enter logo sub heading in Punjabi',
      className: 'col-md-6',
      tab: 'logosection',
    },

    // Government Officials section
    // {
    //   type: 'checkbox',
    //   name: 'government_officials_enabled',
    //   label: 'Government Officials',
    //   required: false,
    //   className: 'col-md-6',
    //   tab: 'logosection',
    // },

    // Government Officials toggle
    {
    type: 'toggle',
    name: 'toogle_status',
    label: 'Government Officials',
    required: false,
   className: 'col-12 partitioned-group government-officials-toggle',
    tab: 'logosection',
     infoTooltip: 'Government Officials settings'
    },

    // Chief Minister and Cabinet Minister logos
    {
      type: 'file',
      name: 'chief_minister_logo',
      label: 'Chief Minister Logo',
      required: false,
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'file',
      name: 'cabinet_minister_logo',
      label: 'Cabinet Minister Logo',
      required: false,
      className: 'col-md-6',
      tab: 'logosection',
    },

    // Chief Minister headings
    {
      type: 'text',
      name: 'chief_minister_logo_heading_en',
      label: 'Chief Minister Logo Heading (en)',
      required: false,
      placeholder: 'Enter Chief Minister name in English',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'chief_minister_logo_heading_pb',
      label: 'Chief Minister Logo Heading (pb)',
      required: false,
      placeholder: 'Enter Chief Minister name in Punjabi',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'chief_minister_logo_sub_heading_en',
      label: 'Chief Minister Logo Sub Heading (en)',
      required: false,
      placeholder: 'Enter Chief Minister designation in English',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'chief_minister_logo_sub_heading_pb',
      label: 'Chief Minister Logo Sub Heading (pb)',
      required: false,
      placeholder: 'Enter Chief Minister designation in Punjabi',
      className: 'col-md-6',
      tab: 'logosection',
    },

    // Cabinet Minister headings
    {
      type: 'text',
      name: 'cabinet_minister_logo_heading_en',
      label: 'Cabinet Minister Logo Heading (en)',
      required: false,
      placeholder: 'Enter Cabinet Minister name in English',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'cabinet_minister_logo_heading_pb',
      label: 'Cabinet Minister Logo Heading (pb)',
      required: false,
      placeholder: 'Enter Cabinet Minister name in Punjabi',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'cabinet_minister_logo_sub_heading_en',
      label: 'Cabinet Minister Logo Sub Heading (en)',
      required: false,
      placeholder: 'Enter Cabinet Minister designation in English',
      className: 'col-md-6',
      tab: 'logosection',
    },
    {
      type: 'text',
      name: 'cabinet_minister_logo_sub_heading_pb',
      label: 'Cabinet Minister Logo Sub Heading (pb)',
      required: false,
      placeholder: 'Enter Cabinet Minister designation in Punjabi',
      className: 'col-md-6',
      tab: 'logosection',
    },

];