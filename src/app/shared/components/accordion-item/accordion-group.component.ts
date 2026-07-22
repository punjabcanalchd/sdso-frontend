import { Component, ContentChildren, QueryList, AfterContentInit, OnDestroy } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';
import { Subject, takeUntil, startWith } from 'rxjs';

@Component({
  selector: 'app-accordion-group',
  standalone: true,
  template: `<div class="d-flex flex-column gap-1" role="list"><ng-content></ng-content></div>`
})
export class AccordionGroupComponent implements AfterContentInit, OnDestroy {
  
  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;
  
  private destroy$ = new Subject<void>();
  private refresh$ = new Subject<void>(); 

  ngAfterContentInit() {
    this.items.changes.pipe(
      startWith(this.items), 
      takeUntil(this.destroy$)
    ).subscribe(() => {
      
      this.refresh$.next(); // Clear out old click to prevent duplicates
      
      // 1. Open the first item
      setTimeout(() => {
        if (this.items.first && !this.items.some(i => i.isOpen)) {
          this.items.first.setOpenState(true);
        }
      });

      // 2. Listen to clicks on all items
      this.items.forEach(item => {
        item.toggled.pipe(takeUntil(this.refresh$)).subscribe(() => {
          
          this.items.forEach(i => i.setOpenState(i === item ? !i.isOpen : false));
        });
      });
      
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}