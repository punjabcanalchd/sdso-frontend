import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const footerFields: FormField[] = [

// =========================
  // CATEGORY 1
  // =========================
  // {
  //   name: '',
  //   label: '',
  //   type: 'html',
  //   tab: 'footer',
  //   html: '<div class="fs-5 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">Footer Section</div>',
  // },

  {
    type: 'text',
    name: 'footer_category_1_title_en',
    label: 'Title English',
    placeholder: 'Enter category title in English',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'text',
    name: 'footer_category_1_title_pb',
    label: 'Title Punjabi',
    placeholder: 'Enter category title in Punjabi',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'select',
    name: 'footer_category_1_menus',
    label: 'Select Menus',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'footer',
    required: false,
    multiple: true,
    options: [
      // Populate dynamically from available menus
      // { value: 'menu_id', label: 'Menu Name' }
    ]
  },

  // =========================
  // CATEGORY 2
  // =========================
  {
    type: 'text',
    name: 'footer_category_2_title_en',
    label: 'Title English',
    infoTooltip:'Help',
    placeholder: 'Enter category title in English',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'text',
    name: 'footer_category_2_title_pb',
    label: 'Title Punjabi',

    placeholder: 'Enter category title in Punjabi',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'select',
    name: 'footer_category_2_menus',
    label: 'Select Menus',
    className: 'col-md-4',
    tab: 'footer',
    required: false,
    multiple: true,
    options: [
      // Populate dynamically from available menus
      // { value: 'menu_id', label: 'Menu Name' }
    ]
  },

  // =========================
  // CATEGORY 3
  // =========================
  {
    type: 'text',
    name: 'footer_category_3_title_en',
    label: 'Title English',
    placeholder: 'Enter category title in English',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'text',
    name: 'footer_category_3_title_pb',
    label: 'Title Punjabi',
    placeholder: 'Enter category title in Punjabi',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'select',
    name: 'footer_category_3_menus',
    label: 'Select Menus',
    className: 'col-md-4',
    tab: 'footer',
    required: false,
    multiple: true,
    options: [
      // Populate dynamically from available menus
      // { value: 'menu_id', label: 'Menu Name' }
    ]
  },

  // =========================
  // COPYRIGHTS
  // =========================
  {
    type: 'text',
    name: 'copyright_heading_1_en',
    label: 'Copy Right Heading 1 (En)',
    infoTooltip:'This will be the Copy Rights of Website',
    placeholder: 'Enter copyright heading',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'text',
    name: 'copyright_heading_1_pb',
    label: 'Copy Right Heading 1 (Pb)',
    placeholder: 'Enter copyright heading in Punjabi',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'text',
    name: 'copyright_heading_2_en',
    label: 'Copy Right Heading 2 (En)',
    placeholder: 'Enter copyright heading',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },
  {
    type: 'text',
    name: 'copyright_heading_2_pb',
    label: 'Copy Right Heading 2 (Pb)',
    placeholder: 'Enter copyright heading in Punjabi',
    className: 'col-md-4',
    tab: 'footer',
    required: true,
  },

    
];