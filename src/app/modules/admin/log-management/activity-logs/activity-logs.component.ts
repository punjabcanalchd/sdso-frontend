import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { ModalHelperService } from '../../../../shared/services/modal-helper';

@Component({
  selector: 'app-activity-logs',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss',
})
export class ActivityLogsComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: any[] = [];
  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';
  isLoaded = false;

  ngOnInit(): void {
    this.loadActivityLogs();
  }

  loadActivityLogs(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getActivityLogs(params).subscribe({

      next: (response) => {

        this.data = response.data.map((log: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: log.public_id,
          log_name: log.log_name,
          description: log.description,
          username: log.causer.name,
          table_name: log.table_name,
          attribute_changes: log.attribute_changes,
          full_data: log.subject.data,
          properties: log.properties,
          created_at: this.formatDate(log.created_at),
        }));

        this.pagination = response.pagination;

        this.currentPage = response.pagination.current_page;

        this.pageSize = response.pagination.per_page;

        this.cdr.detectChanges();

      },

      error: err => {
        console.log(err);
      }

    });

  }


  tableColumns: TableColumn[] = [
    { key: 'log_name', label: 'Log Name', widthClass: 'col-2', sortable: true },
    { key: 'description', label: 'Description', widthClass: 'col-2', sortable: true },
    { key: 'username', label: 'Username', widthClass: 'col-2', sortable: false },
    { key: 'table_name', label: 'Table Name', widthClass: 'col-2', sortable: false },
    { key: 'created_at', label: 'Created At', widthClass: 'col-1', sortable: true },
    {
      key: 'action',
      type: 'dropdown',
      label: 'Choose Action',
      widthClass: 'col-2',
      dropdownConfig: {
        label: 'Choose Action',
        items: (row: any) => {
          const actions = [
            { label: 'Show Details', actionName: 'show', class: 'text-secondary' },
          ];
          return actions;
          
        }
      }
    }
  ];

  changePage(page: number) {

    this.loadActivityLogs(page);

  }

  searchActivityLogs(text: string) {
    this.search = text;

    this.loadActivityLogs(1);

  }

  sortActivityLogs(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadActivityLogs(1);

  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadActivityLogs();
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

  handleAction(event: any): void {
    console.log('event', event);
    if (event.action === 'show' || event.actionName === 'show') {
        this.router.navigate(['/admin/logs', event.row.id]);
    }
  }
}
