import { Component, Input, Output, EventEmitter, ChangeDetectorRef, inject } from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
  animations: [
    trigger('smoothCollapse', [
      state('closed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden',
        visibility: 'hidden'
      })),
      state('open', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden',
        visibility: 'visible'
      })),
      transition('closed <=> open', 
        animate('300ms cubic-bezier(0.2, 0.0, 0.1, .6)'))
      ])
      
    
  ]
})
export class AccordionItemComponent {
  private cdr = inject(ChangeDetectorRef);

  @Input() number?: string;

  /** The question text */
  @Input() question = '';

  /** True if the parent tells this item to be open */
  @Input() isOpen = false;
  /** Emits an event to the parent when the trigger is clicked */
  @Output() toggled = new EventEmitter<void>();

  setOpenState(isOpen: boolean) {
    this.isOpen = isOpen;
    this.cdr.markForCheck(); 
  }
  onHeaderClick(){
    this.toggled.emit();
  }
  onToggle(): void {
    this.toggled.emit();
  }
  
}
