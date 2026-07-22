import { FormGroup } from '@angular/forms';
import { Type } from '@angular/core';

export interface SecurityFeature {
  key: string;
  attach(form: FormGroup): void;
  detach(form: FormGroup): void;
  component: Type<any>;
}
