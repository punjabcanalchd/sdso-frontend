import { Component, OnInit, ChangeDetectorRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { FormSchema } from '../../../../core/models/form-schema.model';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';

export interface ClientQueryItem {
  id: number;
  public_id: string;
  name: string;
  email: string;
  contact: string;
  address?: string;
  subject: string;
  subject_code?: number;
  details: string;
  division_id?: number;
  division_name?: string;
  entity_name?: string;
  office_name?: string;
  division_stacked?: {
    division: string;
    entity: string;
    office: string;
  };
  water_entity_code?: string | number;
  upload_pdf?: string;
  pdf_url?: string;
  has_attachment?: boolean;
  status: number;
  status_label: string;
  status_class: string;
  created_at?: string;
  created_at_display?: string;
  remarks_count?: number;
  remarks?: any[];
}

@Component({
  standalone: true,
  selector: 'app-client-queries-list',
  imports: [CommonModule, FormsModule, DocumentListComponent, ModalFormComponent],
  templateUrl: './client-queries-list.component.html',
  styleUrl: './client-queries-list.component.scss'
})
export class ClientQueriesListComponent implements OnInit {
  @ViewChild(ModalFormComponent) addRemarkModal!: ModalFormComponent;

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  currentView: 'list' | 'view' | 'remarks' = 'list';

  // 1. Queries Listing State
  data: any[] = [];
  rawQueries: ClientQueryItem[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = 'created_at';
  sortDirection = 'desc';

  // 2. Selected Query State (View & Remarks)
  selectedQuery: ClientQueryItem | null = null;
  isLoadingDetails = false;

  // 3. Remarks Listing State
  remarksData: any[] = [];
  remarkInitialData: any = {};
  isSubmittingRemark = false;

  // FormSchema for Reusable ModalFormComponent
  remarkSchema: FormSchema = {
    submitLabel: 'Save',
    fields: [
      {
        name: 'remark',
        label: 'Remark',
        type: 'textarea',
        required: true,
        placeholder: 'Enter remark here...'
      }
    ],
    buttons: [
      {
        label: 'Save',
        type: 'submit',
        class: 'btn btn-primary btn-sm px-3'
      }
    ]
  };

  // Main Table Columns
  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'address', label: 'Address', sortable: false },
    { key: 'subject', label: 'Subject', sortable: false },
    { key: 'division_info', label: 'Division / Entity Name / Office', type: 'html', sortable: false },
    { key: 'created_at', label: 'Created AT', sortable: true },
    {
      key: 'actions',
      label: 'Action',
      type: 'client_query_action'
    }
  ];

  // Remarks Table Columns
  remarksColumns: TableColumn[] = [
    { key: 'remark', label: 'Remark', sortable: false },
    { key: 'status_badge', label: 'Status', type: 'html', sortable: false },
    { key: 'created_at', label: 'Created AT', sortable: false }
  ];

  ngOnInit(): void {
    this.loadQueries();
  }

  loadQueries(page: number = this.currentPage): void {
    this.currentPage = page;
    const params: any = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.isLoading = true;
    this.api.get<any>('/admin/client-queries', params).subscribe({
      next: (res) => {
        this.rawQueries = res.data || [];
        this.data = this.rawQueries.map((item: ClientQueryItem, index: number) => {
          const divisionHtml = `
            <div><strong>${this.escapeHtml(item.division_name || 'N/A')}</strong></div>
            <div class="text-secondary small">${this.escapeHtml(item.entity_name || 'N/A')}</div>
            <div class="text-secondary small">${this.escapeHtml(item.office_name || 'N/A')}</div>
          `.trim();

          return {
            id: item.public_id || item.id,
            rawId: item.id,
            orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
            name: item.name || 'N/A',
            email: item.email || 'N/A',
            contact: item.contact || 'N/A',
            address: item.address || 'N/A',
            subject: item.subject || 'Others',
            division_info: divisionHtml,
            created_at: item.created_at || item.created_at_display || '',
            status: item.status,
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
        this.toast.show('error', err.error?.message || 'Failed to load client queries');
        this.cdr.detectChanges();
      }
    });
  }

  searchQueries(text: string): void {
    this.search = text?.trim() || '';
    this.loadQueries(1);
  }

  sortQueries(event: any): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.loadQueries(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = Number(size) || 25;
    this.loadQueries(1);
  }

  handleAction(event: any): void {
    const action = event.action || event.actionName;
    const row = event.row;
    const item: ClientQueryItem = row.raw || row;

    if (action === 'view') {
      this.openQueryView(item);
    } else if (action === 'toggle_status') {
      this.toggleStatus(item);
    } else if (action === 'remarks') {
      this.openRemarksView(item);
    }
  }

  openQueryView(item: ClientQueryItem): void {
    this.selectedQuery = item;
    this.currentView = 'view';
    this.isLoadingDetails = true;

    const queryKey = item.public_id || item.id;
    this.api.get<any>(`/admin/client-queries/${queryKey}`).subscribe({
      next: (res) => {
        if (res.data) {
          this.selectedQuery = res.data;
        }
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      }
    });
  }

  openRemarksView(item: ClientQueryItem): void {
    this.selectedQuery = item;
    this.currentView = 'remarks';
    this.loadRemarks(item);
  }

  loadRemarks(item: ClientQueryItem): void {
    const queryKey = item.public_id || item.id;
    this.isLoadingDetails = true;

    this.api.get<any>(`/admin/client-queries/${queryKey}`).subscribe({
      next: (res) => {
        if (res.data) {
          this.selectedQuery = res.data;
        }
        this.mapRemarksData();
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mapRemarksData();
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      }
    });
  }

  mapRemarksData(): void {
    const remarks = this.selectedQuery?.remarks || [];
    this.remarksData = remarks.map((rem: any, idx: number) => {
      let badgeClass = 'bg-warning text-dark';
      if (rem.status === 1) badgeClass = 'bg-info text-dark';
      if (rem.status === 2) badgeClass = 'bg-success text-white';

      const label = rem.status_label || (rem.status === 1 ? 'In Progress' : (rem.status === 2 ? 'Resolved' : 'Pending'));

      return {
        id: rem.id,
        orignalSeq: idx + 1,
        remark: rem.remark,
        status_badge: `<span class="badge ${badgeClass} px-2 py-1">${this.escapeHtml(label)}</span>`,
        created_at: rem.created_at_display || rem.created_at || ''
      };
    });
  }

  toggleStatus(item: ClientQueryItem): void {
    const newStatus = (item.status === 0) ? 1 : (item.status === 1 ? 2 : 0);
    const queryKey = item.public_id || item.id;

    this.api.post(`/admin/client-queries/${queryKey}/status`, { status: newStatus }).subscribe({
      next: (res: any) => {
        item.status = newStatus;
        if (res.data) {
          item.status_label = res.data.status_label;
          item.status_class = res.data.status_class;
        }
        this.toast.show('success', res.message || 'Status updated successfully', 2500);
        this.loadQueries(this.currentPage);
      },
      error: (err: any) => {
        this.toast.show('error', err.error?.message || 'Failed to update status');
      }
    });
  }

  openAddRemarkModal(): void {
    this.remarkInitialData = { remark: '' };
    this.addRemarkModal?.open();
  }

  onSaveRemark(formData: any): void {
    const remarkText = formData?.remark?.trim();
    if (!this.selectedQuery || !remarkText) {
      this.toast.show('error', 'Please enter a remark');
      return;
    }

    const queryKey = this.selectedQuery.public_id || this.selectedQuery.id;
    this.isSubmittingRemark = true;

    this.api.post(`/admin/client-queries/${queryKey}/remark`, { remark: remarkText }).subscribe({
      next: (res: any) => {
        this.isSubmittingRemark = false;
        this.toast.show('success', res.message || 'Remark added successfully', 3000);
        this.addRemarkModal?.close();
        if (this.selectedQuery) {
          this.loadRemarks(this.selectedQuery);
        }
      },
      error: (err: any) => {
        this.isSubmittingRemark = false;
        this.toast.show('error', err.error?.message || 'Failed to add remark');
        this.cdr.detectChanges();
      }
    });
  }

  backToList(): void {
    this.currentView = 'list';
    this.selectedQuery = null;
    this.loadQueries(this.currentPage);
  }

  private escapeHtml(str: string): string {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
