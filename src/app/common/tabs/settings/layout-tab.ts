import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const layoutFields: FormField[] = [


    // =====================================================
    // DISPLAY MENUS
    // =====================================================

    {
      type: 'select',
      name: 'menus',
      label: 'Menus',
      tab: 'layout',
      className: 'col-md-4',
      required: false,
      options: [
        {
          label: 'Design Consultancy',
          value: 'design-consultancy'
        },
        {
          label: 'Publication',
          value: 'publication'
        },
        {
          label: 'Rotational Program',
          value: 'rotational-program'
        },
        {
          label: 'Tourism',
          value: 'tourism'
        },
        {
          label: 'HOME',
          value: 'home'
        }
      ]
    },


    // =====================================================
    // SLIDER SETTINGS
    // =====================================================

    {
      type: 'select',
      name: 'home_page_slider',
      label: 'Home Page Slider',
      tab: 'layout',
      className: 'col-md-4',
      required: false,
      options: [
        {
          label: 'Home Slider',
          value: 'home-slider'
        }
      ]
    },

    {
      type: 'text',
      name: 'home_page_slider_timing',
      label: 'Home Page Slider Timing',
      placeholder: '5000',
      tab: 'layout',
      className: 'col-md-4',
      required: false
    },

    {
      type: 'select',
      name: 'footer_slider',
      label: 'Footer Slider',
      className: 'col-md-4',
      tab: 'layout',
      required: false,
      options: [
        {
          label: 'Footer Section',
          value: 'footer-section'
        }
      ]
    },


    // =====================================================
    // HOME PAGE LINKS
    // =====================================================

    {
      type: 'select',
      name: 'home_page_link_slider',
      label: 'Home Page Link Slider',
      className: 'col-md-4',
      tab: 'layout',
      required: false,
      options: [
        {
          label: 'Please select',
          value: ''
        }
      ]
    },

    {
      type: 'select',
      name: 'home_page_other_links_slider',
      tab: 'layout',
      label: 'Home Page Other Links Slider',
      className: 'col-md-4',
      required: false,
      options: [
        {
          label: 'Please select',
          value: ''
        }
      ]
    },

    {
      type: 'select',
      name: 'home_page_top_footer_links_slider',
      label: 'Home Page Top Footer Links Slider',
      className: 'col-md-4',
      tab: 'layout',
      required: false,
      options: [
        {
          label: 'Footer Top Slider',
          value: 'footer-top-slider'
        }
      ]
    },


    // =====================================================
    // LINK PAGES
    // =====================================================

    {
      type: 'select',
      name: 'index_text_page',
      label: 'Index Text Page',
      className: 'col-md-4',
      tab: 'layout',
      required: false,
      options: [
        {
          label: 'About Us',
          value: 'about-us'
        }
      ]
    },

    {
      type: 'select',
      name: 'screen_reader_page',
      label: 'Screen Reader Page',
      tab: 'layout',
      className: 'col-md-4',
      required: false,
      options: [
        {
          label: 'Please select a Page',
          value: ''
        }
      ]
    },


    // =====================================================
    // BANNERS
    // =====================================================

    {
      type: 'file',
      name: 'default_page_banner',
      label: 'Default Page Banner',
      tab: 'layout',
      className: 'col-md-4',
      required: false
    },

    {
      type: 'file',
      name: 'search_page_banner',
      label: 'Search Page Banner',
      tab: 'layout',
      className: 'col-md-4',
      required: false
    },

    {
      type: 'file',
      name: 'punjab_map',
      label: 'Punjab Map',
      tab: 'layout',
      className: 'col-md-4',
      required: false
    }

  ];


