import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface DropdownItem {
  label: string;
  actionName: string;
  class?: string;
}

export interface TableColumn {
  key: string;           // The object property ( 'description', 'email', 'name')
  label: string;         // The Table Header text ('Description', 'Email Address')
  type?: 'text' | 'html' | 'download' | 'action' |'button'| 'dropdown' | 'edit' | 'unlock' | 'toggle' | 'delete'; // How to render the cell
  widthClass?: string;   // Bootstrap column classes ( 'col-7', 'col-2')

  buttonConfig?: {
    text: string;
    class?: string;     // 'btn-danger', 'btn-outline-primary'
    actionName: string; // The identifier sent on (actionClick)
  };
  dropdownConfig?: {
    label: string;      // Fallback label for the dropdown button
    items: DropdownItem[] | ((row: any) => DropdownItem[]);
  };
   toggleConfig?: {
    trueLabel: string;
    falseLabel: string;
  };
}

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss',
})
export class DocumentListComponent implements OnChanges {
  
  @ContentChild('actionTemplate') actionTemplate!: TemplateRef<any>;
  
  @Input() title = 'Data List';

  @Input() isAdmin: boolean =false; 

  @Input() data: any[] = [];
  
  @Input() columns: TableColumn[] = [];

  @Input() showCreateButton: boolean = false;

  @Output() actionClick = new EventEmitter<{ action: string, row: any }>();

  @Output() createClick = new EventEmitter<void>();

  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 25;
  @Input() lastPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  @Output() pageSizeChange = new EventEmitter<number>();

  @Output() searchChange = new EventEmitter<string>();

  @Output() sortChange = new EventEmitter<{
    column: string;
    direction: 'asc' | 'desc';
  }>();

  // ── Internal State 
  activeSortColumn= "";
  activeSortDirection: 'asc' | 'desc' | '' = '';
  searchTerm = '';
  pageSizeOptions = [5, 10, 25, 50];

  pagedData: any[] = [];
  pageNumbers: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['data'] ||
      changes['currentPage'] ||
      changes['lastPage'] ||
      changes['pageSize']
    ) {

      this.pagedData = [...this.data];

      this.pageNumbers = Array.from(
        { length: this.lastPage },
        (_, i) => i + 1
      );

    }

  }
  
 sortData(column: string, direction: 'asc' | 'desc') {

    if (
      this.activeSortColumn === column &&
      this.activeSortDirection === direction
    ) {
      this.activeSortColumn = '';
      this.activeSortDirection = '';
    } else {
      this.activeSortColumn = column;
      this.activeSortDirection = direction;
    }

    this.sortChange.emit({
      column: this.activeSortColumn,
      direction: this.activeSortDirection || 'asc'
    });

  }


  onSearchChange(event: Event): void {

    this.searchTerm = (event.target as HTMLInputElement).value;

    this.searchChange.emit(this.searchTerm);

  }

  onPageSizeChange(event: Event): void {

    this.pageSize = Number(
      (event.target as HTMLSelectElement).value
    );

    this.pageSizeChange.emit(this.pageSize);

  }

 goToPage(page: number): void {

    console.log('Page clicked:', page);

    if (page < 1 || page > this.lastPage) {
        return;
    }

    this.currentPage = page;

    this.pageChange.emit(page);
}

  getSerialNo(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  getMathMin(val1: number, val2: number): number {
    return Math.min(val1, val2);
  }

  onCustomAction(actionType: string, row: any): void {
    this.actionClick.emit({ action: actionType, row: row });
  }
    onCreate(): void {
    this.createClick.emit();
  }


  async downloadFile(row: any): Promise<void> {
    if (!row.fileUrl || row.fileUrl === '#') {
      alert('File not available yet.');
      return;
    }
    
   try {
      const response = await fetch(row.fileUrl);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = localUrl;
      link.download = 'document.pdf'; 

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(localUrl);

    } catch (error) {
      console.error('Download failed:', error);
      window.open(row.fileUrl, '_blank', 'noopener,noreferrer');
    }
  }
}