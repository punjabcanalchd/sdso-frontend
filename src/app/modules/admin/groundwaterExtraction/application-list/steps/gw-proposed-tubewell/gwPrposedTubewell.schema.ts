import { FormSchema } from '../../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../../common/validation/custom-validators';

export const gwProposedTubewellSchema: FormSchema = {
//   title: 'EXISTING FUNCTIONAL TUBEWELL DETAILS',

  fields: [
    {
      type: 'html',
      name: 'detailsOfPrposedTubewells',
      label: '',
      html: `
        <div class="fs-2f w-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">
         Details Of Proposed Tubewells: (Under Construction/To be Constructed).
        </div>
      `
    },

    {
      type: 'number',
      name: 'totalNumberTubeWells ',
      label: 'Total Number of Tube-Wells ',
      required: true,
      min: 0,
      validators: [
        CustomValidators.positiveInt()
      ]
    },
 
  ]
};