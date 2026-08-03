import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { Office } from '../../../../core/models/office.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { OfficeSchema } from './offices-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';

@Component({
  selector: 'app-offices',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.scss',
})
export class OfficesComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  private encryptService = inject(EncryptionService);
  private toast = inject(ToastService);
  private modalHelper = inject(ModalHelperService);

  data: Office[] = [];
  formInitialData: any = {};
  allDivisionList: any[] = [];
  isEditMode = false;

  OfficeSchema = OfficeSchema;
  updatingOfficeId: string | null = null;


  officeInitialData: any = {};
  isOfficeLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  ngOnInit(): void {
    this.loadOffices();
  }

  loadOffices(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getOffices(params).subscribe({

      next: (response) => {

        this.data = response.data.map((office: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: office.office_id,
          name_en: office.name_en,
          name_pb: office.name_pb,
          division: office.division,
          officelevel: office.officelevel,
          state: office.state,
          circle: office.circle,
          subdivision: office.subdivision,
          email: office.email,
          mobile: office.mobile,
          status: office.status ? 'Active' : 'In-active',
          created_at: this.formatDate(office.created_at),
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
    { key: 'name_en', label: 'Name EN', widthClass: 'col-2', sortable: true },
    { key: 'name_pb', label: 'Name PB', widthClass: 'col-2', sortable: true },
    { key: 'officelevel', label: 'Office Level', widthClass: 'col-2', sortable: false },
    { key: 'state', label: 'State', widthClass: 'col-2', sortable: false },
    { key: 'circle', label: 'Circle', widthClass: 'col-2', sortable: false },
    { key: 'division', label: 'Division', widthClass: 'col-2', sortable: false },
    { key: 'subdivision', label: 'Subdivision', widthClass: 'col-2', sortable: false },
    { key: 'email', label: 'Email', widthClass: 'col-2', sortable: true },
    //{ key: 'mobile', label: 'Mobile', widthClass: 'col-2', sortable: false },
    { key: 'status', label: 'Status', widthClass: 'col-2', sortable: true },
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
            { label: 'Edit', actionName: 'edit', class: 'text-secondary' },
          ];
          return actions;
          
        }
      }
    }
  ];

  changePage(page: number) {

    this.loadOffices(page);

  }

  onSearch(text: string) {
    this.search = text;

    this.loadOffices(1);

  }

  onSort(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadOffices(1);

  }

  openCreateModal(){

  }

  onSubmit(formData: any){

  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadOffices();
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
    if (event.action === 'EDIT' || event.actionName === 'EDIT') {
    }
  }
}
