import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() options: { label: string; value: any }[] = [];
  @Input() placeholder: string = 'Please Select';
  @Input() maxSelect?: number;
  @Input() disabled: boolean = false;

  isOpen = false;
  searchQuery = '';

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    if (this.disabled || (this.control && this.control.disabled)) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = '';
    }
  }

  get selectedValues(): string[] {
    const val = this.control?.value;
    if (Array.isArray(val)) {
      return val.map(v => String(v)).filter(v => v !== '' && v !== 'null' && v !== 'undefined');
    }
    if (val !== null && val !== undefined && val !== '') {
      return [String(val)];
    }
    return [];
  }

  get validOptions(): { label: string; value: any }[] {
    return (this.options || []).filter(opt => opt.value !== '' && opt.value !== null && opt.value !== undefined);
  }

  get filteredOptions(): { label: string; value: any }[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.validOptions;
    return this.validOptions.filter(opt =>
      (opt.label || '').toLowerCase().includes(q)
    );
  }

  isSelected(value: any): boolean {
    const strVal = String(value);
    return this.selectedValues.includes(strVal);
  }

  getOptionLabel(value: any): string {
    const strVal = String(value);
    const found = (this.options || []).find(opt => String(opt.value) === strVal);
    return found ? found.label : strVal;
  }

  toggleOption(value: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.disabled || (this.control && this.control.disabled)) return;

    const strVal = String(value);
    let current = [...this.selectedValues];

    if (current.includes(strVal)) {
      current = current.filter(v => v !== strVal);
    } else {
      if (this.maxSelect && current.length >= this.maxSelect) {
        return;
      }
      current.push(strVal);
    }

    this.control?.setValue(current);
    this.control?.markAsDirty();
    this.control?.markAsTouched();
  }

  removeOption(value: any, event: Event): void {
    event.stopPropagation();
    if (this.disabled || (this.control && this.control.disabled)) return;

    const strVal = String(value);
    const updated = this.selectedValues.filter(v => v !== strVal);
    this.control?.setValue(updated);
    this.control?.markAsDirty();
    this.control?.markAsTouched();
  }

  selectAll(event: Event): void {
    event.stopPropagation();
    if (this.disabled || (this.control && this.control.disabled)) return;

    let all = this.validOptions.map(opt => String(opt.value));
    if (this.maxSelect) {
      all = all.slice(0, this.maxSelect);
    }
    this.control?.setValue(all);
    this.control?.markAsDirty();
    this.control?.markAsTouched();
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    if (this.disabled || (this.control && this.control.disabled)) return;

    this.control?.setValue([]);
    this.control?.markAsDirty();
    this.control?.markAsTouched();
  }
}
