import { Directive, HostListener, Optional } from '@angular/core';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';

@Directive({
  selector: '[appClearGlobalErrorOnFocus]',
  standalone: true
})
export class ClearGlobalErrorOnFocusDirective {

  constructor(
    @Optional() private dynamicForm: DynamicFormComponent
  ) {}

  @HostListener('focus')
  onFocus(): void {
    if (this.dynamicForm) {
      this.dynamicForm.clearGlobalError();
    }
  }
}
