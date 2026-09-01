export interface Page {
  public_id: string;
  name_en: string;
  name_pb: string;
  created_at: string;
  status: boolean;

  description_en?: string;
  description_pb?: string;

  meta_title_en?: string;
  meta_title_pb?: string;

  meta_description_en?: string;
  meta_description_pb?: string;

  meta_keyword_en?: string;
  meta_keyword_pb?: string;

  slug?: string;
  sort_order?: number;
  page_type?: number | string;
  external_url?: string;
}