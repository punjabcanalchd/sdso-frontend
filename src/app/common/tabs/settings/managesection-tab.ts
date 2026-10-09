import { FormField } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../validation/custom-validators';
import { Validators } from '@angular/forms';

export const manageSectionFields: FormField[] = [
  {
    type: 'select',
    name: 'section_1_status',
    label: 'Section 1',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'managesection',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    type: 'select',
    name: 'section_2_status',
    label: 'Section 2',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'managesection',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    type: 'select',
    name: 'section_3_status',
    label: 'Section 3',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'managesection',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    type: 'select',
    name: 'section_4_status',
    label: 'Section 4',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'managesection',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    type: 'select',
    name: 'section_5_status',
    label: 'Section 5',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'managesection',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    type: 'select',
    name: 'section_6_status',
    label: 'Section 6',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'managesection',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    type: 'select',
    name: 'section_7_status',
    label: 'Section 7',
    infoTooltip:'Help',
    className: 'col-md-4',
    tab: 'managesection',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  }
];
