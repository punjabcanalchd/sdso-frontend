export interface Slider {
  public_id: string;

  slider_id?: number;

  title_en?: string;
  title_pb?: string;

  description_en?: string;
  description_pb?: string;

  image?: string;
  image_en?: string;
  image_pb?: string;

  button_text_en?: string;
  button_text_pb?: string;

  button_url?: string;

  status: boolean;
  sort_order?: number;

  created_at?: string;
  updated_at?: string;
}