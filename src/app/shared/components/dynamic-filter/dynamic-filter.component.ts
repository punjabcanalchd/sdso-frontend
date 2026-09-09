import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterField {
  name: string;
  label: string;
  type: 'select' | 'text' | 'date';
  options?: { label: string; value: any }[];
  disabled?: boolean;
  colClass?: string;
  value?: any;
}

@Component({
  selector: 'app-dynamic-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-filter.component.html',
  styleUrls: ['./dynamic-filter.component.scss']
})
export class DynamicFilterComponent implements OnChanges {
  @Input() schema: FilterField[] = [];
  @Input() showFilterButton: boolean = true;
  @Input() showResetButton: boolean = true;

  @Output() filter = new EventEmitter<Record<string, any>>();
  @Output() reset = new EventEmitter<void>();
  @Output() fieldChange = new EventEmitter<{ name: string; value: any }>();

  values: Record<string, any> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] && this.schema) {
      this.schema.forEach(field => {
        if (!(field.name in this.values)) {
          this.values[field.name] = field.value ?? '';
        }
      });
    }
  }

  onModelChange(name: string, value: any): void {
    this.values[name] = value;
    this.fieldChange.emit({ name, value });
  }

  onFilterClick(): void {
    this.filter.emit(this.values);
  }

  onResetClick(): void {
    this.values = {};
    this.schema.forEach(field => {
      this.values[field.name] = '';
    });
    this.reset.emit();
  }
}
