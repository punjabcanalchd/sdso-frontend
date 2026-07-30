import { FormField } from '../../../../core/models/form-schema.model';

export const punjabiFields: FormField[] = [

  // {
  //   name: 'header_h_pb',
  //   label: '',
  //   type: 'html',
  //   tab: 'punjabi',
  //   html: '<div class="font_color fw-bold text-uppercase small">Punjabi Details</div>'
  // },

  {
    name: 'same_as_english_pb',
    label: '',
    type: 'checkbox',
    tab: 'punjabi',
    text: 'Same as English'
  },

  {
    name: 'title_pb',
    label: 'Title',
    type: 'text',
    tab: 'punjabi',
    placeholder: 'Enter Title'
  },
  {
    name: 'description_pb',
    label: 'Description',
    type: 'editor',
    tab: 'punjabi'
  },
  {
  name: 'header_meta_pb',
  label: '',
  type: 'html',
  tab: 'punjabi',
  html: '<div class="font_color fw-bold text-uppercase small">Meta Information</div>',
},
{
  type: 'text',
  name: 'meta_title_pb',
  label: 'Meta Title',
  tab: 'punjabi',
  className: 'col-md-4',
},
{
  type: 'text',
  name: 'meta_description_pb',
  label: 'Meta Description',
  tab: 'punjabi',
  className: 'col-md-4',
},
{
  type: 'text',
  name: 'meta_keyword_pb',
  label: 'Meta Keyword',
  tab: 'punjabi',
  className: 'col-md-4',
},
];