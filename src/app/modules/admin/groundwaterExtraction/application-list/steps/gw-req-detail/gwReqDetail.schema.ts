import { FormSchema } from '../../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../../common/validation/custom-validators';

export const gwReqDetailSchema: FormSchema = {
  
  fields: [
    {
      type: 'number',
      name: 'totalWaterRequirement',
      label: 'Total Water Requirement (m³/month)',
      required: true,
      min: 1,
      validators: [
      CustomValidators.decimal2() 
       ]    
      },

     {
      type: 'html',
      name: 'DewateringRequirementSection',
      label: '',
      html: `
        <div class="fs-2f w-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">
         Dewatering Requirement, if any (m³/month)
        </div>
      `
    },

    {
      type: 'number',
      name: 'freshWaterB1',
      label: 'Fresh Water (b1)',
      required: false,
      min: 0,
      validators: [
        CustomValidators.decimal2()
      ]
    },

    {
      type: 'html',
      name: 'groundWaterRequirementSection',
      label: '',
      html: `
        <div class="fs-2f w-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">
        Ground water requirement (m³/month)
        </div>`
    },

    {
      type: 'number',
      name: 'freshWaterC1',
      label: 'Fresh Water (c1)',
      required: true,
      min: 300,     
        validators: [
        CustomValidators.decimal2()
      ]
    },

    {
      type: 'file',
      name: 'canalWaterCertificate',
      label: 'Non Availability of Canal Water Certificate',
      required: true,   
      validators: [CustomValidators.fileTypes(['pdf'])]
    },
      {
      type: 'html',
      name: 'dewateringSection',
      label: '',
      html: `
        <div class="fs-2f w-bold text-uppercase pb-1 ps-0 pe-0 mb-0 border-bottom border-warning border-3 d-inline-block text-dark">
        Total Volume of Ground Water for which permission is sought (m³/month)
        </div>
      `
    },
    
    {
      type: 'number',
      name: 'totalGroundWaterVolume',
      label: 'Fresh Water: c1',
      required: true,
      min: 300,
        validators: [
        CustomValidators.decimal2()
      ]
     
    }
  ]
};