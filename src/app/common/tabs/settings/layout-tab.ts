import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const layoutFields: FormField[] = [

    {
    name: '',
    label: '',
    type: 'html',
    tab: 'layout',
    html: '<div class="fs-5 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">DISPLAY MENUS</div>',
   },

    // =====================================================
    // DISPLAY MENUS
    // =====================================================

    {
      type: 'select',
      name: 'menus',
      label: 'Menus',
      infoTooltip:'Menus that will show on the top of the website and Admin can select Max 8 Menus',
      tab: 'layout',
      className: 'col-md-4',
      required: false,
      options: [
      { label: 'Please Select', value: '' }
    ]
    },

  {
    name: '',
    label: '',
    type: 'html',
    tab: 'layout',
    html: '<div class="fs-5 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">SLIDER SETTINGS</div>',
   },
    // =====================================================
    // SLIDER SETTINGS
    // =====================================================

    {
      type: 'select',
      name: 'home_page_slider',
      label: 'Home Page Slider',
      infoTooltip:'Slider that will show on top of the landing page',
      tab: 'layout',
      className: 'col-md-4',
      required: false,
      options: [
      { label: 'Please Select', value: '' }
    
      ]
    },

    {
      type: 'text',
      name: 'home_page_slider_timing',
      label: 'Home Page Slider Timing',
      infoTooltip:'Time should be in milliseconds',
      placeholder: '5000',
      tab: 'layout',
      className: 'col-md-4',
      required: false
    },

    {
      type: 'select',
      name: 'footer_slider',
      label: 'Footer Slider',
      infoTooltip:'Slider that will show on very bottom of footer',
      className: 'col-md-4',
      tab: 'layout',
      required: false,
      options: [
      { label: 'Please Select', value: '' }
    ]
    },

    {
    name: '',
    label: '',
    type: 'html',
    tab: 'layout',
    html: '<div class="fs-5 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">HOME PAGE LINKS</div>',
   },

    // =====================================================
    // HOME PAGE LINKS
    // =====================================================

    {
      type: 'select',
      name: 'home_page_link_slider',
      label: 'Home Page Link Slider',
      infoTooltip:'Slider will show in the middle of the page. It will hold links',
      className: 'col-md-4',
      tab: 'layout',
      required: false,
      options: [
        {
          label: 'Please Select',
          value: ''
        }
      ]
    },

    {
      type: 'select',
      name: 'home_page_other_links_slider',
      tab: 'layout',
      label: 'Home Page Other Links Slider',
      infoTooltip:'Slider that will show Show next to the home page link slider. It also will hold links',
      className: 'col-md-4',
      required: false,
       options: [
      { label: 'Please Select Other Link Slider', value: '' }
     ]
    },

    {
      type: 'select',
      name: 'home_page_top_footer_links_slider',
      label: 'Home Page Top Footer Links Slider',
      infoTooltip:'Slider that will show on the top on footer that will hold links',
      className: 'col-md-4',
      tab: 'layout',
      required: false,
       options: [
      { label: 'Please Select Footer Link Slider', value: '' }
    ]
    },


    {
    name: '',
    label: '',
    type: 'html',
    tab: 'layout',
    html: '<div class="fs-5 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">LINK PAGES</div>',
   },
    // =====================================================
    // LINK PAGES
    // =====================================================

    {
      type: 'select',
      name: 'index_text_page',
      label: 'Index Text Page',
      infoTooltip:'Text of the page that should be shown on the landing page',
      className: 'col-md-4',
      tab: 'layout',
      required: false,
       options: [
      { label: 'Please Select ', value: '' }
    ]
    },

    {
      type: 'select',
      name: 'screen_reader_page',
      label: 'Screen Reader Page',
      infoTooltip:'link to the screen reader page',
      tab: 'layout',
      className: 'col-md-4',
      required: false,
      options: [
      { label: 'Please Select ', value: '' }
    ]
    },

     {
    name: '',
    label: '',
    type: 'html',
    tab: 'layout',
    html: '<div class="fs-5 fw-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">BANNERS</div>',
   },


    // =====================================================
    // BANNERS
    // =====================================================

    {
      type: 'file',
      name: 'default_page_banner',
      label: 'Default Page Banner',
      infoTooltip:'Default website banner will be shown when admin does not select any Image for the page',
      tab: 'layout',
      className: 'col-md-4',
      required: false
    },

    {
      type: 'file',
      name: 'search_page_banner',
      label: 'Search Page Banner',
      infoTooltip:'Default search banner will be shown when admin does not select any Image for the Search page',
      tab: 'layout',
      className: 'col-md-4',
      required: false
    },

    {
      type: 'file',
      name: 'punjab_map',
      label: 'Punjab Map',
      infoTooltip:'Punjab map',
      tab: 'layout',
      className: 'col-md-4',
      required: false
    }

  ];


