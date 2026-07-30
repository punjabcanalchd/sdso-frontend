import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { Designation } from '../../../../core/models/designation.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { DesignationSchema } from './designations-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';

@Component({
  selector: 'app-designations',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './designations.component.html',
  styleUrl: './designations.component.scss',
})
export class DesignationsComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  private encryptService = inject(EncryptionService);
  private toast = inject(ToastService);
  private modalHelper = inject(ModalHelperService);

  data: Designation[] = [];
  formInitialData: any = {};
  allDesignationList: any[] = [];
  isEditMode = false;

  DesignationSchema = DesignationSchema;
  updatingDesignationId: string | null = null;


  designationInitialData: any = {};
  isDesignationLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getDesignations(params).subscribe({

      next: (response) => {

        this.data = response.data.map((designation: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: designation.public_id,
          name_en: designation.name_en,
          name_pb: designation.name_pb,
          desigsenioritylevel: designation.desigsenioritylevel,
          status: designation.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(designation.created_at),
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
    { key: 'desigsenioritylevel', label: 'Level', widthClass: 'col-2', sortable: true },
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

    this.loadDesignations(page);

  }

  onSearch(text: string) {
    this.search = text;

    this.loadDesignations(1);

  }

  onSort(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadDesignations(1);

  }

  openCreateModal(){

  }

  onSubmit(formData: any){

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
