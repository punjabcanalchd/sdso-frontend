import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-email-templates-list',
  imports: [CommonModule, DocumentListComponent],
  templateUrl: './email-templates-list.component.html',
  styleUrl: './email-templates-list.component.scss'
})
export class EmailTemplatesListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  data: any[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = 'template_id';
  sortDirection = 'desc';

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Template Name', widthClass: 'col-3', sortable: true },
    { key: 'subjectHtml', label: 'Subject', widthClass: 'col-5', sortable: false, type: 'html' },
    { key: 'status', label: 'Status', widthClass: 'col-2', type: 'toggle', toggleConfig: { trueLabel: 'Active', falseLabel: 'Inactive' } },
    { key: 'created_at', label: 'Created At', widthClass: 'col-2', sortable: true },
  ];

  ngOnInit(): void {
    this.loadTemplates();
  }

  formatDate(dateInput: any): string {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  loadTemplates(page: number = this.currentPage): void {
    this.currentPage = page;
    const params: any = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.isLoading = true;
    this.api.get<any>('/admin/email-templates', params).subscribe({
      next: (res) => {
        this.data = (res.data || []).map((item: any, index: number) => {
          const englishSubject = item.subject_en || 'N/A';
          const punjabiSubject = item.subject_pb
            ? `<div class="text-dark lh-1 pt-2">
                <span class="text-muted fw-bold small">PB:</span>
                ${item.subject_pb}
              </div>`
            : '';

          return {
            id: item.id,
            orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
            name: item.name,
            subjectHtml: `
              <div class="text-dark pb-1 lh-1">
                <span class="text-muted fw-bold small">EN:</span>
                ${englishSubject}
              </div>
              ${punjabiSubject}
            `,
            status: item.status,
            created_at: this.formatDate(item.created_at),
            raw: item
          };
        });

        this.pagination = res.pagination || {};
        this.currentPage = res.pagination?.current_page || 1;
        this.pageSize = res.pagination?.per_page || 25;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.show('error', err.error?.message || 'Failed to load email templates');
        this.cdr.detectChanges();
      }
    });
  }

  handleAction(event: { action: string; row: any }): void {
    if (event.action === 'toggle_status') {
      this.updateStatus(event.row.id, event.row.status);
    }
  }

  updateStatus(id: string | number, status: boolean | number): void {
    const statusValue = status ? 1 : 0;
    this.api.post(`/admin/email-templates/${id}/status`, { status: statusValue }).subscribe({
      next: (res: any) => {
        this.toast.show('success', res.message || 'Status updated successfully', 3000);
        this.loadTemplates();
      },
      error: (err: any) => {
        this.toast.show('error', err.error?.message || 'Failed to update status');
        this.loadTemplates();
      }
    });
  }

  searchTemplates(text: string): void {
    this.search = text;
    this.loadTemplates(1);
  }

  sortTemplates(event: any): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.loadTemplates(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadTemplates(1);
  }
}
