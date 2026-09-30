import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';

export const sliderImageSchema: FormSchema = {

  layoutStyle: 'popup',
  submitLabel: 'Create Slider Image',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary',
    fields: [    
            {
            name: 'image',
            label: 'Image',
            type: 'file',
            className: 'col-md-4',
            required: true,
            // accept: '.jpg,.jpeg,.png,.webp'
        },
        {           
            name: 'title',
            label: 'Title English',
            type: 'text',
            className: 'col-md-4',
            // required: true
        },
        {
            name: 'title_pb',
            label: 'Title Punjabi',
            type: 'text',
            className: 'col-md-4',
            // required: true
        },
        {
            name: 'link',
            label: 'Link',
            type: 'text',
            className: 'col-md-4',
            // required: false
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            className: 'col-md-4',
            options: [
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 }
            ]
        }
    ]
}
