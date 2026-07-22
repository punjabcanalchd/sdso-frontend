import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-generic-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-data-table.component.html',
  styleUrl: './generic-data-table.component.css'
})
export class GenericDataTableComponent {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Output() rowClicked = new EventEmitter<any>();
  @Output() sortChanged = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();

  onRowClick(row: any) {
    this.rowClicked.emit(row);
  }

}
