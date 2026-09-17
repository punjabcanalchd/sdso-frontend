import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';


export const sliderSchema: FormSchema = {

  layoutStyle: 'popup',
  submitLabel: 'Create Slider',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary',


  fields: [    
    {
      type: 'text',
      name: 'name',
      label: 'Slider name',
      className: 'col-md-4',
       required: true,  
        validators: [
        CustomValidators.shortAlpha()
        ],

    },
      
    {
      type: 'select',
      name: 'status',
      label: 'Status',
      className: 'col-md-4',
      placeholder:'Select Status',

      options: [
        {
          label: 'Active',
          value: true // or 1 depending on backend return
        },
        {
          label: 'Inactive',
          value: false // or 0
        }
      ]
    },
    
    
    

    
  ]
 
};