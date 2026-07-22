import { FormSchema } from '../../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../../common/validation/custom-validators';

export const unitUserDetailsSchema: FormSchema = {
  isMultiFormWizard: true,

    // {
  // title: 'UNIT DETAILS',
  fields: [
      {
      type: 'text',
      name: 'unitName',
      label: 'Name of the Unit',
      required: true,
      min: 2,
      max: 100,
      validators: [
        CustomValidators.shortAlpha()
      ]
    },
    {
      type: 'select',
      name: 'interimPermissionGranted',
      label: 'Whether Ad Interim Permission Granted',
      required: true,
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      validators: [CustomValidators.requiredSelection()]
    },
    {
      type: 'select',
      name: 'registeredBusinessFirstPortal',
      label: 'Is the Unit Registered with Department of Industries, Govt. of Punjab on Business First Portal',
      required: true,
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      validators: [CustomValidators.requiredSelection()]
    },
    
    {
      type: 'file',
      name: 'partnershipDeed',
      label: 'Partnership Deed/Registration Certificate of Company or Firm etc',
      validators: [CustomValidators.fileTypes(['pdf'])]
    },
    {
      type: 'file',
      name: 'complianceReport',
      label: 'Compliance Report of Previous Permission Conditions in Annotated Form',
      validators: [CustomValidators.fileTypes(['pdf'])]
    },
    {
      type: 'select',
      name: 'unitType',
      label: 'Type of Unit',
      required: true,
      options: [
        { label: 'Industrial', value: 'Industrial' },
        { label: 'Commercial', value: 'Commercial' },
        { label: 'Institutional', value: 'Institutional' },
        { label: 'Housing Infrastructure', value: 'Housing Infrastructure' },
        { label: 'Mining', value: 'Mining' },
        { label: 'Others', value: 'Others' }
      ],
      validators: [CustomValidators.requiredSelection()]
    },
    {
      type: 'text',
      name: 'mainProcessActivity',
      label: 'Main Process/Activity/Business of the Unit',
      required: true,
      max: 200,
       validators: [
    CustomValidators.textContent()
  ]
    },
    {
      type: 'text',
      name: 'panNumber',
      label: 'PAN of Unit (if Applicable)',
      max: 10,
      validators: [
        CustomValidators.pan()
      ]
    },
    {
      type: 'select',
      name: 'gstRegistered',
      label: 'Is the Unit have GST Registration',
      required: true,
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      validators: [CustomValidators.requiredSelection()]
    },
    {
      type: 'text',
      name: 'gstNumber',
      label: 'GST Number',
      max: 15,
      validators: [
        CustomValidators.gst()
      ]
    },
    {
      type: 'file',
      name: 'gstCertificate',
      label: 'GST Certificate',
      validators: [CustomValidators.fileTypes(['pdf'])]
    },
    {
      type: 'select',
      name: 'extractingGroundWater',
      label: 'Is the Unit Already Extracting Ground Water?',
      required: true,
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      validators: [CustomValidators.requiredSelection()]
    },
    {
     type: 'datepicker',
      name: 'dateSinceExtracting',
      label: 'Date Since Extracting',
      placeholder: 'Select Date',
      required: true,
      minDate: '2000-01-01',
      maxDate: '2035-12-31',  
      validators: [CustomValidators.validDate()]
    },
    {
      type: 'select',
      name: 'waterType',
      label: 'Water Type',
      required: true,
      options: [
        { label: 'Fresh', value: 'Fresh' },
        { label: 'Saline', value: 'Saline' },
        { label: 'Both', value: 'Both' }
      ],
      validators: [CustomValidators.requiredSelection()]

    },
    {
      type: 'select',
      name: 'sportsInfrastructure',
      label: 'Whether Unit Comprises or Contains a Stadium/Cricket Ground or Other Sports Ground/Sports Court or Golf Course etc. Within its Premises (Y/N)',
      required: true,
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      validators: [CustomValidators.requiredSelection()]

    },
    {
      type: 'radio',
      name: 'sugarMill',
      label: 'Whether Unit is Sugar Mill (Y/N)',
      required: true,
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
       validators: [CustomValidators.requiredSelection()]

    }
  ]
}
