import { FormSchema } from '../../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../../common/validation/custom-validators';


export const gwExistingTubewellDetailSchema: FormSchema = {
  // title: 'EXISTING FUNCTIONAL TUBEWELL DETAILS',

  fields: [
    {
      type: 'html',
      name: 'existingTubewellHeader',
      label: '',
      html: `
        <div class="fs-2f w-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">
          Details Of Existing Functional Tube Wells As on date of submission of application
        </div>
      `
    },

    {
      type: 'number',
      name: 'existingTubewellCount',
      label: 'No. of existing Tube-Wells',
      required: true,
      min: 0,
      validators: [
        CustomValidators.nonNegative()
      ]
    },

    {
      type: 'html',
      name: 'tubewellDetailsHeader',
      label: '',
      html: `
        <div class="fs-2f w-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">    
        Details of Each Tube-Wells
        </div>
      `
    },

    {
      type: 'number',
      name: 'serialNumber',
      label: 'Serial Number',
      required: true,
      min: 1,
      readonly: true,
      validators: [CustomValidators.positiveInt()]
    },
   {
      type: 'datepicker',
      name: 'energizedDate',
      label: 'Date on Which Energized',
      placeholder: 'Select Date',
      required: true,
      minDate: '2000-01-01',
      maxDate: '2035-12-31',  
      validators: [
        CustomValidators.validDate()       
      ]
    },

    {
      type: 'select',
      name: 'tubewellType',
      label: 'Tubewell Type',
      required: true,
      options: [
        { label: 'Please Select', value: '' },
        { label: 'Bore Well', value: 'BORE_WELL' },
        { label: 'Tube Well', value: 'TUBE_WELL' },
        { label: 'Open Well', value: 'OPEN_WELL' }
      ],
      validators: [
        CustomValidators.requiredSelection()
      ]
    },

    {
      type: 'number',
      name: 'wellDepth',
      label: 'Depth of Well (m)',
      required: true,
      min: 1,
      validators: [
         CustomValidators.decimal2()
      ]
    },

    {
      type: 'number',
      name: 'wellDiameter',
      label: 'Diameter of Well (cm)',
      required: true,
      min: 1,
      validators: [
         CustomValidators.decimal2()
      ]
    },

    {
      type: 'number',
      name: 'maximumDischargeCapacity',
      label: 'Maximum Discharge Capacity (lpm)',
      required: true,
      min: 1,
      validators: [
        CustomValidators.decimal2()
      ]
    },

    {
      type: 'number',
      name: 'pumpHP',
      label: 'HP of Pump',
      required: true,
      min: 1,
      validators: [
        CustomValidators.positiveInt()
      ]
    },

    {
      type: 'number',
      name: 'pumpLoweredDepth',
      label: 'Depth at Which Pump Lowered (mbgl)',
      required: true,
      min: 1,
      validators: [
        CustomValidators.positiveInt()
      ]
    },

    {
      type: 'select',
      name: 'meterInstalled',
      label: 'Whether Meter Installed',
      required: true,
      options: [
        { label: 'Please Select', value: '' },
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      validators: [
        CustomValidators.requiredSelection()
      ]
    },

    {
      type: 'textarea',
      name: 'remarks',
      label: 'Remarks',
      placeholder: 'Enter Remarks',
      validators: [CustomValidators.textContent()]
    }
  ]
};