import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-translations-list',
  imports: [CommonModule, DocumentListComponent],
  templateUrl: './translations-list.component.html',
  styleUrl: './translations-list.component.scss'
})
export class TranslationsListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  data: any[] = [];
  pagination: any = {};
  currentPage = 1;
  pageSize = 25;
  search = '';
  sortColumn = 'key_id';
  sortDirection = 'asc';

  tabs = [
    { label: 'General', value: 1 },
    { label: 'Homepage', value: 2 },
    { label: 'Errors', value: 3 }
  ];
  selectedGroup = 1;

  tableColumns: TableColumn[] = [
    { key: 'translation_key', label: 'Unique Key', widthClass: 'col-4', sortable: true },
    { key: 'pb', label: 'PB', widthClass: 'col-4', sortable: false },
    { key: 'en', label: 'EN', widthClass: 'col-4', sortable: false },
  ];

  ngOnInit(): void {
    this.loadTranslations();
  }

  selectTab(group: number): void {
    this.selectedGroup = group;
    this.currentPage = 1;
    this.loadTranslations();
  }

  loadTranslations(page: number = this.currentPage): void {
    this.currentPage = page;
    const params: any = {
      page: this.currentPage,
      per_page: this.pageSize,
      group: this.selectedGroup,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.api.get<any>('/admin/translations', params).subscribe({
      next: (res) => {
        this.data = (res.data || []).map((item: any, index: number) => ({
          ...item,
          id: item.key_id,
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1
        }));
        this.pagination = res.pagination || {};
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.show('error', err.error?.message || 'Failed to load translations');
      }
    });
  }

  onSearchChange(text: string): void {
    this.search = text;
    this.currentPage = 1;
    this.loadTranslations();
  }

  onSortChange(event: any): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.loadTranslations(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadTranslations();
  }
}
