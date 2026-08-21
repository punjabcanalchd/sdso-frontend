import { FormField } from '../../core/models/form-schema.model';


export interface TabSchema {
  id: string;
  label: string;
  disabled?: boolean;

  tabs?: TabSchema[];
  
  fields?: FormField[];
}