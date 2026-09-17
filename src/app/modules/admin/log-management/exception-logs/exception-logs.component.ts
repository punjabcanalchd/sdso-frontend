import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { ModalHelperService } from '../../../../shared/services/modal-helper';

@Component({
  selector: 'app-exception-logs',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './exception-logs.component.html',
  styleUrl: './exception-logs.component.scss',
})
export class ExceptionLogsComponent implements OnInit {

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
    this.loadExceptionLogs();
  }

  loadExceptionLogs(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getExceptionLogs(params).subscribe({

      next: (response) => {

        this.data = response.data.map((log: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: log.public_id,
          message: log.message,
          line: log.line,
          trace: log.trace,
          url: log.url,
          body: log.body,
          ip: log.ip,
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
    { key: 'url', label: 'URL', widthClass: 'col-2 text-break text-wrap', sortable: true },
    { key: 'ip', label: 'IP', widthClass: 'col-2', sortable: false },
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

    this.loadExceptionLogs(page);

  }

  searchExceptionLogs(text: string) {
    this.search = text;

    this.loadExceptionLogs(1);

  }

  sortExceptionLogs(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadExceptionLogs(1);

  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadExceptionLogs();
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
        this.router.navigate(['/admin/exception-log', event.row.id]);
    }
  }
}
