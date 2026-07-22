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


  // ── Internal State 
  activeSortColumn= "";
  activeSortDirection: 'asc' | 'desc' | '' = '';
  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50];

  filteredData: any[] = [];
  pagedData: any[] = [];
  totalPages = 1;
  pageNumbers: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.data.forEach((item, index) => {
        item.orignalSeq = index + 1;
      });
     
    }
      if(changes['data'] || changes['columns']){
        this.currentPage = 1;
        this.processDataPipeline();
      }
  }

  sortData(columnKey: string, direction: 'asc' | 'desc'): void {
    if (this.activeSortColumn === columnKey && this.activeSortDirection === direction) {
      this.activeSortColumn = '';
      this.activeSortDirection = '';
    } else {
      this.activeSortColumn = columnKey;
      this.activeSortDirection = direction;
    }
    
    this.currentPage = 1;
    this.processDataPipeline();
  }



  processDataPipeline(): void {
    const term = this.searchTerm.trim().toLowerCase();
    
    this.filteredData = term
      ? this.data.filter(item =>
          this.columns.some(col => {
            const val = item[col.key];
            return val && String(val).toLowerCase().includes(term);
          })
        )
      : [...this.data];

   if (this.activeSortColumn && this.activeSortDirection) {
      this.filteredData.sort((a, b) => {
        const valA = a[this.activeSortColumn] || '';
        const valB = b[this.activeSortColumn] || '';
        const cmp = typeof valA === 'string' ? valA.localeCompare(valB) : (valA > valB ? 1 : (valA < valB ? -1 : 0));
        return this.activeSortDirection === 'asc' ? cmp : -cmp;
      });
    }

    this.totalPages = Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedData = this.filteredData.slice(start, start + this.pageSize);
  }

  onSearchChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.searchTerm = inputEl?.value ?? '';
    this.currentPage = 1;
    this.processDataPipeline();
  }

  onPageSizeChange(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    this.pageSize = Number(selectEl?.value ?? 10);
    this.currentPage = 1;
    this.processDataPipeline();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedData = this.filteredData.slice(start, start + this.pageSize);
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