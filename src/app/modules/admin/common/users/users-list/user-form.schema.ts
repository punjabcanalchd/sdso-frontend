import { FormSchema } from '../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../common/validation/custom-validators';

export const userSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn btn-primary-govt',
  steps: [
    {
      title: 'Personal Details',
      fields: [
        {
          name: 'hrmscode',
          label: 'HRMS Code',
          type: 'text',
          placeholder: 'Enter Hrms Code',
          required: true,
          className: 'col-md-4',
          validators: [CustomValidators.digitsOnly()]
        },
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter Name',
          className: 'col-md-4',
          validators: [CustomValidators.shortAlpha()]
        },
        {
          name: 'email',
          label: 'E-Mail',
          type: 'email',
          placeholder: 'Enter Email',
          required: true,
          className: 'col-md-4',
          validationMessages: {
            required: 'Please enter your email address',
            email: 'Please enter a valid email address'
          },
          validators: [CustomValidators.email()],
        },
        {
          name: 'mobile_number',
          label: 'Mobile Number',
          type: 'text',
          placeholder: 'Enter Mobile Number',
          required: true,
          max: 10,
          min: 10,
          validationMessages: {
            required: 'Please enter your contact number',
            phone: 'Please enter a valid contact number'
          },
          validators: [CustomValidators.phone10()],
          className: 'col-md-4'
        },
        {
          name: 'retirementdate',
          label: 'Retirement Date',
          type: 'datepicker',
          required: true,
          className: 'col-md-4',
          validators: [CustomValidators.dateInFuture()],
        },
        {
          name: 'officelevelcode',
          label: 'Office Level',
          type: 'select',
          className: 'col-md-4',
          options: [
            { label: 'CHIEF OFFICE', value: 'CHIEF OFFICE' },
            { label: 'CIRCLE OFFICE', value: 'CIRCLE OFFICE' },
            { label: 'DIVISION OFFICE', value: 'DIVISION OFFICE' },
            { label: 'Gauge Reader/Beldaar', value: 'Gauge Reader/Beldaar' },
            { label: 'Junior Engineer', value: 'Junior Engineer' },
            { label: 'Office of PSWR', value: 'Office of PSWR' },
            { label: 'SUB DIVISION OFFICE', value: 'SUB DIVISION OFFICE' },
          ]
        },
        {
          name: 'circle_id',
          label: 'Circle Name',
          type: 'select',
          className: 'col-md-4',
          visibleWhen: { 
            field: 'officelevelcode', 
            value: ['CIRCLE OFFICE', 'DIVISION OFFICE', 'SUB DIVISION OFFICE', 'Gauge Reader/Beldaar', 'Junior Engineer'] 
          },
          options: [
            { label: 'Circle 1', value: '1' },
            { label: 'Circle 2', value: '2' }
          ]
        },
        {
          name: 'division_id',
          label: 'Division',
          type: 'select',
          className: 'col-md-4',
          visibleWhen: { 
            field: 'officelevelcode', 
            value: ['DIVISION OFFICE', 'SUB DIVISION OFFICE', 'Gauge Reader/Beldaar', 'Junior Engineer'] 
          },
          options: [
            { label: 'Division A', value: 'A' },
            { label: 'Division B', value: 'B' }
          ]
        },
        {
          name: 'subdivision_id',
          label: 'Sub Division',
          type: 'select',
          className: 'col-md-4',
          // Only show when SUB DIVISION OFFICE is selected
          visibleWhen: { field: 'officelevelcode', value: 'SUB DIVISION OFFICE' },
          options: [
            { label: 'Sub Div X', value: 'X' },
            { label: 'Sub Div Y', value: 'Y' }
          ]
        },
        {
          name: 'officecode',
          label: 'Office',
          type: 'select',
          className: 'col-md-4',
          // Always visible as a fallback, or add a visibleWhen condition if needed
          options: [
            { label: 'Office 1', value: 'O1' },
            { label: 'Office 2', value: 'O2' }
          ]
        },

        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter Password',
          required: true,
          className: 'col-md-4',
          showPasswordToggle: true,
          validators: [CustomValidators.password()],
          validationMessages: {
            pattern: 'Password should contain uppercase, lowercase, number and special character'
          }
        },
        {
          name: 'password_confirmation',
          label: 'Confirm Password',
          type: 'password',
          placeholder: 'Confirm New Password',
          required: true,
          className: 'col-md-4',
          matchField: 'password',
          showPasswordToggle: true,
          validators: [CustomValidators.matchPassword('password')],
          updateOn: 'change'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'toggle',
          required: true,
          className: 'col-md-4',
          options: [
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' }
          ]
        },
      ]
    },
    {
      title: 'Assignments',
      fields: [
        {
          name: 'role_assignment',
          label: 'Assign Roles to User',
          type: 'role-assignment',
          className: 'col-md-12',
          required: true,
          options: [],
          validators: [
            (control: any) => {
              const val = control.value;
              if (!val || !val.role_id || !val.selected_roles || val.selected_roles.length === 0) {
                return { validationMessage: 'Please select a primary role and at least one role.' };
              }
              return null;
            }
          ]
        }
      ]
    }
  ]
};
