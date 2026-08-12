import { FormField } from '../../core/models/form-schema.model';

export const metaPunjabiFields: FormField[] = [
  {
    name: 'header_meta_pb',
    label: '',
    type: 'html',
    tab: 'meta-punjabi',
    html: '<div class="font_color fw-bold text-uppercase small">Meta Information</div>',
  },

  {
    type: 'text',
    name: 'meta_title_pb',
    label: 'Meta Title',
    tab: 'meta-punjabi',
    className: 'col-md-4',
  },

  {
    type: 'text',
    name: 'meta_description_pb',
    label: 'Meta Description',
    tab: 'meta-punjabi',
    className: 'col-md-4',
  },

  {
    type: 'text',
    name: 'meta_keyword_pb',
    label: 'Meta Keyword',
    tab: 'meta-punjabi',
    className: 'col-md-4',
  },
];