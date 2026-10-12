import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const footerFields: FormField[] = [

// =========================
  // CATEGORY 
  // =========================
  {
    name: '',
    label: '',
    type: 'html',
    tab: 'footer',
    html: '<div class="fs-5 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">Footer Section</div>',
  },


  {
    type: "html",
    name: '',
    label: '',
    tab: 'footer',
    className: 'col-md-4',
    html: '<div class="fs-6 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 d-inline-block text-dark">Category 1:</div>',
  },

  {
    type: "html",
    name: '',
    label: '',
    tab: 'footer',
    className: 'col-md-4',
    html: '<div class="fs-6 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 d-inline-block text-dark">Category 2:</div>',
  },
  {
    type: "html",
    name: '',
    label: '',
    tab: 'footer',
    className: 'col-md-4',
    html: '<div class="fs-6 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 d-inline-block text-dark">Category 3:</div>',
  },

// =========================
  // English Title 
  // =========================
  {
    type: 'text',
    name: 'footer_category_1_title_en',
    label: 'Title English',
    className: 'col-md-4',
    tab: 'footer',
  },
  {
    type: 'text',
    name: 'footer_category_2_title_en',
    label: 'Title English', 
    className: 'col-md-4',
    tab: 'footer',
  },
  {
    type: 'text',
    name: 'footer_category_3_title_en',
    label: 'Title English',
  className: 'col-md-4',
    tab: 'footer',
  
  },

  
// =========================
  // Punjabi Title
  // =========================

  {
    type: 'text',
    name: 'footer_category_1_title_pb',
    label: 'Title Punjabi',
  // infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'footer',
  },
  

  {
    type: 'text',
    name: 'footer_category_2_title_pb',
    label: 'Title Punjabi',
  className: 'col-md-4',
    tab: 'footer',    
  },

  
  {
    type: 'text',
    name: 'footer_category_3_title_pb',
    label: 'Title Punjabi',
  className: 'col-md-4',
    tab: 'footer',  
  },


// =========================
  // Menu DropDown
  // =========================
  {
    type: 'select',
    name: 'footer_category_1_menus',
    label: 'Select Menus',   
    className: 'col-md-4',
    tab: 'footer',   
    multiple: true,
    options: [
      // Populate dynamically from available menus
     { label: 'Please Select', value: '' }
    ]
  },
  {
    type: 'select',
    name: 'footer_category_2_menus',
    label: 'Select Menus',
    className: 'col-md-4',
    tab: 'footer',   
    multiple: true,
    options: [
      // Populate dynamically from available menus
      { label: 'Please Select', value: '' }
    ]
  },

 
  {
    type: 'select',
    name: 'footer_category_3_menus',
    label: 'Select Menus',
    className: 'col-md-4',
    tab: 'footer', 
    multiple: true,
    options: [
     { label: 'Please Select', value: '' }
    ]
  },

  // =========================
  // COPYRIGHTS
  // =========================
   {
    name: '',
    label: '',
    type: 'html',
    tab: 'footer',
    html: '<div class="fs-5 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">Copy Right</div>',
    infoTooltip:'This will be the Copy Rights of Website',

  },
  {
    type: 'text',
    name: 'copyright_heading_1_en',
    label: 'Copy Right Heading 1 (En)',
    className: 'col-md-6',
    tab: 'footer',   
  },
  {
    type: 'text',
    name: 'copyright_heading_1_pb',
    label: 'Copy Right Heading 1 (Pb)',
    className: 'col-md-6',
    tab: 'footer', 
  },
  {
    type: 'text',
    name: 'copyright_heading_2_en',
    label: 'Copy Right Heading 2 (En)',
    className: 'col-md-6',
    tab: 'footer',
    
  },
  {
    type: 'text',
    name: 'copyright_heading_2_pb',
    label: 'Copy Right Heading 2 (Pb)',
    className: 'col-md-6',
    tab: 'footer',
  },

    
];