import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective {
  @Input() debounceTime = 500;
  private lastClick = 0;

  @HostListener('click', ['$event'])
  clickEvent(event: Event) {
    const now = Date.now();
    if (now - this.lastClick > this.debounceTime) {
      this.lastClick = now;
    } else {
      event.stopImmediatePropagation();
    }
  }
}
