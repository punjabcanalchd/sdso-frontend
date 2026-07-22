import { FormSchema } from '../../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../../common/validation/custom-validators';

export const layoutPlansSchema: FormSchema = {


  fields: [
    {
      type: 'html',
      name: 'LAYOUT PLAN INDICATING LOCATION OF EXTRACTION STRUCTURES.',
      label: '',
      html: `
        <div class="fs-2f w-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">
         Details Of Proposed Tubewells: (Under Construction/To be Constructed).
        </div>
      `
    },

    { 
      type: 'select',
      name: 'layoutPlanType',
      label: 'Layout Plan indicating location of Extraction Structures',
      required: true,
      options: [
        {
          label: 'Please Select',
          value: ''
        },
        {
          label: 'Self-Certified',
          value: 'SELF_CERTIFIED'
        },
        {
          label: 'Approved by the Competent Authority',
          value: 'APPROVED_AUTHORITY'
        }
      ],
      validators: [ CustomValidators.requiredSelection()]
      
    },

    {
      type: 'file',
      name: 'layoutPlanDocument',
      label: 'Attach Approved Building Plan or Self Certified Layout Plan Showing the Location of the Tubewell',
      required: true,
     validators: [CustomValidators.fileTypes(['pdf'])]
    }
 
  ]
};