import { FormSchema } from '../../../../core/models/form-schema.model';

export const mediaGalleryImageSchema: FormSchema = {
  layoutStyle: 'popup',
  submitLabel: 'Save Image',
  submitIcon: 'bi bi-floppy',
  submitClass: 'btn-primary-govt',
  fields: [
    {
      name: 'file',
      label: 'Upload File',
      type: 'file',
      className: 'col-12',
      required: true
    },
    {
      name: 'title_en',
      label: 'Title (English)',
      type: 'text',
      className: 'col-md-6',
      required: true,
      placeholder: 'Enter English Title'
    },
    {
      name: 'title_pb',
      label: 'Title (Punjabi)',
      type: 'text',
      className: 'col-md-6',
      required: true,
      placeholder: 'Enter Punjabi Title'
    }
  ]
};
