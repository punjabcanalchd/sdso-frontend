import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { Office } from '../../../../core/models/office.model';
import { OfficeHierarchy } from '../../../../core/models/office-hierarchy.model';
import { State } from '../../../../core/models/state.model';
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

  @ViewChild(ModalFormComponent) officeModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: Office[] = [];
  formInitialData: any = {};
  isEditMode = false;

  OfficeSchema = OfficeSchema;
  updatingOfficeId: string | null = null;
  officeId: string | null = null;

  officeInitialData: any = {};
  isOfficeLoading: boolean = false;
  officeLevels: OfficeHierarchy[] = [];
  states: State[] = [];
  isLoaded = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  showCircle = false;
  showDivision = false;
  showSubdivision = false;

  circleList: any[] = [];
  divisionList: any[] = [];
  subdivisionList: any[] = [];
  districtList: any[] = [];

  allDivisionList: any[] = [];
  allSubdivisionList: any[] = [];
  allDistrictList: any[] = [];

  officeLevelRules: Record<string, {
    showCircle: boolean;
    showDivision: boolean;
    showSubdivision: boolean;
  }> = {

    'Sub division office': {
      showCircle: true,
      showDivision: true,
      showSubdivision: true
    },

    'Guage Reader': {
      showCircle: true,
      showDivision: true,
      showSubdivision: true
    },

    'JE': {
      showCircle: true,
      showDivision: true,
      showSubdivision: true
    },

    'division office': {
      showCircle: true,
      showDivision: true,
      showSubdivision: false
    },

    'circle office': {
      showCircle: true,
      showDivision: false,
      showSubdivision: false
    },

    'chief officer': {
      showCircle: false,
      showDivision: false,
      showSubdivision: false
    },

    'PSWR': {
      showCircle: false,
      showDivision: false,
      showSubdivision: false
    }
  };

  ngOnInit(): void {
    this.loadOffices();
    this.getOfficeLevels();
    this.getStates();
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

  getOfficeLevels(): void {
    const params = {};
    this.userService.getAllOfficeHierarchy(params).subscribe({
      next: (response) => {
          this.officeLevels = response;
          const officeLevels = response.data || [];
          const parentOptions = officeLevels.map((OfficeHierarchy: any) => ({
            label: OfficeHierarchy.name_en,
            value: String(OfficeHierarchy.public_id)
          }));
          console.log(parentOptions);
          const parentField = this.OfficeSchema.fields?.find(
            f => f.name === 'officelevelcode'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select Office level', value: '' },
              ...parentOptions
            ];
          }
          const form = this.officeModal?.dynamicForm?.form;
          form.get('officelevelcode')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading office level:', error);
      }
    });
  }

  getStates(): void {
    const params = {};
    this.userService.getAllStates(params).subscribe({
      next: (response) => {
          this.states = response;
          const states = response.data || [];
          const parentOptions = states.map((state: any) => ({
            label: state.name_en,
            value: String(state.public_id)
          }));
          console.log(parentOptions);
          const parentField = this.OfficeSchema.fields?.find(
            f => f.name === 'lgdstatecode'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select state', value: '' },
              ...parentOptions
            ];
          }
          const form = this.officeModal?.dynamicForm?.form;
          form.get('lgdstatecode')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading states:', error);
      }
    });
  }

  onFieldChange(event: any): void {

    const fieldName = event.name;
    const value = event.value;
    console.log('fieldName', fieldName);
    console.log('value', value);
    if (fieldName === 'officelevelcode') {
      this.handleOfficeLevelChange(value);
    }

    if (fieldName === 'circle_id') {
      this.handleCircleChange(value);
    }

    if (fieldName === 'division_id') {
      this.handleDivisionChange(value);
    }

    if (fieldName === 'lgdstatecode') {
      this.handleStateChange(value);
    }
  }

  handleOfficeLevelChange(officeLevel: string): void {

    const rule = this.officeLevelRules[officeLevel];

    if (!rule) {
      this.showCircle = false;
      this.showDivision = false;
      this.showSubdivision = false;
      return;
    }

    this.showCircle = rule.showCircle;
    this.showDivision = rule.showDivision;
    this.showSubdivision = rule.showSubdivision;

    /*
    * Reset unnecessary dependent values
    */

    if (!this.showCircle) {

      this.formInitialData.circle_id = null;
      this.formInitialData.division_id = null;
      this.formInitialData.subdivision_id = null;

      this.divisionList = [];
      this.subdivisionList = [];

    } else if (!this.showDivision) {

      this.formInitialData.division_id = null;
      this.formInitialData.subdivision_id = null;

      this.subdivisionList = [];

    } else if (!this.showSubdivision) {

      this.formInitialData.subdivision_id = null;

    }

    this.updateSchemaVisibility();
  }

  handleCircleChange(circleId: any): void {

    if (!circleId) {

      this.divisionList = [];
      this.subdivisionList = [];

      this.formInitialData.division_id = null;
      this.formInitialData.subdivision_id = null;

      this.updateSchemaOptions();

      return;
    }

    /*
    * If divisions are already loaded
    */

    this.divisionList = this.allDivisionList.filter(
      division => String(division.circle_id) === String(circleId)
    );

    /*
    * Reset division and subdivision
    */

    this.formInitialData.division_id = null;
    this.formInitialData.subdivision_id = null;

    this.subdivisionList = [];

    this.updateSchemaOptions();
  }

  handleDivisionChange(divisionId: any): void {

    if (!divisionId) {

      this.subdivisionList = [];

      this.formInitialData.subdivision_id = null;

      this.updateSchemaOptions();

      return;
    }

    this.subdivisionList = this.allSubdivisionList.filter(
      subdivision =>
        String(subdivision.division_id) === String(divisionId)
    );

    this.formInitialData.subdivision_id = null;

    this.updateSchemaOptions();
  }

  handleStateChange(lgdstatecode: any): void {

    if (!lgdstatecode) {

      this.districtList = [];

      this.formInitialData.lgddistcode = null;

      this.updateSchemaOptions();

      return;
    }

    this.districtList = this.allDistrictList.filter(
      district =>
        String(district.lgdstatecode) === String(lgdstatecode)
    );

    this.formInitialData.lgddistcode = null;

    this.updateSchemaOptions();
  }

  updateSchemaVisibility(): void {

    this.OfficeSchema.fields = this.OfficeSchema.fields?.map(field => {

      if (field.name === 'circle_id') {
        return {
          ...field,
          hidden: !this.showCircle
        };
      }

      if (field.name === 'division_id') {
        return {
          ...field,
          hidden: !this.showDivision
        };
      }

      if (field.name === 'subdivision_id') {
        return {
          ...field,
          hidden: !this.showSubdivision
        };
      }

      return field;
    });

  }

  updateSchemaOptions(): void {

    this.OfficeSchema.fields = this.OfficeSchema.fields?.map(field => {

      if (field.name === 'circle_id') {
        return {
          ...field,
          options: this.circleList.map(item => ({
            label: item.name_en,
            value: item.id
          }))
        };
      }

      if (field.name === 'division_id') {
        return {
          ...field,
          options: this.divisionList.map(item => ({
            label: item.name_en,
            value: item.id
          }))
        };
      }

      if (field.name === 'subdivision_id') {
        return {
          ...field,
          options: this.subdivisionList.map(item => ({
            label: item.name_en,
            value: item.id
          }))
        };
      }

      return field;

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

  openCreateModal() {
    this.isEditMode = false;
    this.officeId = null;

    this.modalHelper.openModal({
      modalRef: this.officeModal, 
      schema: this.OfficeSchema,
      submitLabel: 'Create Division',
      patchData: { name: '', search: '', selectAll: false, permissions: { slugs: [] } },
      useRouting: true,        
      route: this.route,
      queryParamId: null   
    });
  }

  onModalClosed() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: null },
      queryParamsHandling: 'merge'
    });
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
    console.log('event', event);
    if (event.action === 'EDIT' || event.actionName === 'EDIT') {
    }
  }
}
