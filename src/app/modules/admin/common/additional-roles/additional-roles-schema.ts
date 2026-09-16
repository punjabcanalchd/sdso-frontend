import { FilterField } from '../../../../shared/components/dynamic-filter/dynamic-filter.component';
import { FormSchema } from '../../../../core/models/form-schema.model';

// ── 1. DYNAMIC FILTER SCHEMA ──────────────────────────────────────────
export const additionalRoleFilterSchema: FilterField[] = [
  {
    name: 'officelevelcode',
    label: 'Office Level',
    type: 'select',
    colClass: 'col-md-2',
    options: []
  },
  {
    name: 'circle_id',
    label: 'Circle Name',
    type: 'select',
    colClass: 'col-md-2',
    options: []
  },
  {
    name: 'division_id',
    label: 'Division',
    type: 'select',
    colClass: 'col-md-2',
    disabled: true,
    options: []
  },
  {
    name: 'subdivision_id',
    label: 'Sub Division',
    type: 'select',
    colClass: 'col-md-2',
    disabled: true,
    options: []
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    colClass: 'col-md-2',
    options: [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '0' }
    ]
  }
];

// ── 2. CREATE / EDIT MODAL FORM SCHEMA (3-Column Layout matching Screenshot 2) ──
export const additionalRoleFormSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Update',
  submitIcon: 'bi bi-check2-circle',
  submitClass: 'btn btn-primary-govt',
  steps: [
    {
      title: 'Additional Role Details',
      fields: [
        // Row 1
        {
          name: 'officelevelcode',
          label: 'Office Level',
          type: 'select',
          required: true,
          className: 'col-md-4',
          placeholder: 'Please Select',
          options: []
        },
        {
          name: 'circle_id',
          label: 'Circle Name',
          type: 'select',
          className: 'col-md-4',
          placeholder: 'Please Select',
          options: []
        },
        {
          name: 'division_id',
          label: 'Division',
          type: 'select',
          required: true,
          className: 'col-md-4',
          placeholder: 'Please Select',
          options: []
        },
        // Row 2
        {
          name: 'subdivision_id',
          label: 'Sub Division',
          type: 'select',
          required: true,
          className: 'col-md-4',
          placeholder: 'Please Select',
          options: []
        },
        {
          name: 'officecode',
          label: 'Office',
          type: 'select',
          required: true,
          className: 'col-md-4',
          placeholder: 'Please Select',
          options: []
        },
        {
          name: 'user_id',
          label: 'User Name',
          type: 'select',
          required: true,
          className: 'col-md-4',
          placeholder: 'Please Select',
          options: []
        },
        // Row 3
        {
          name: 'role_id',
          label: 'Role',
          type: 'select',
          required: true,
          className: 'col-md-4',
          placeholder: 'Please Select',
          options: []
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          className: 'col-md-4',
          placeholder: 'Please Select',
          options: [
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 }
          ]
        }
      ]
    }
  ]
};
