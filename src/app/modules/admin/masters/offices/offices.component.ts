import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { Office } from '../../../../core/models/office.model';
import { OfficeHierarchy } from '../../../../core/models/office-hierarchy.model';
import { State } from '../../../../core/models/state.model';
// import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
// import { EncryptionService } from '../../../../core/services/encrypt.service';
// import { ToastService } from '../../../../shared/services/toast.service';
import { OfficeSchema } from './offices-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';
import {  FilterField } from '../../../../shared/components/dynamic-filter/dynamic-filter.component';
import { OfficeHierarchyService } from '../../../../core/services/office-hierarchy.service';



@Component({
  selector: 'app-offices',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.scss',
})
export class OfficesComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) officeModal!: ModalFormComponent;

  // private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);
  private officeHierarchyService = inject(OfficeHierarchyService);

  data: Office[] = [];
  formInitialData: any = {};
  isEditMode = false;

  OfficeSchema = OfficeSchema;
  updatingOfficeId: string | null = null;
  officeId: string | null = null;
  officeLevelNameToPublicId: Record<string, string> = {};

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

  // Filter state
  filterCircleId = '';
  filterDivisionId = '';
  filterSubdivisionId = '';

  filterSchema: FilterField[] = [
    { name: 'circle_id', label: 'Circle', type: 'select', options: [] },
    { name: 'division_id', label: 'Division', type: 'select', options: [], disabled: true },
    { name: 'subdivision_id', label: 'Sub Division', type: 'select', options: [], disabled: true },
  ];

  // Filter dropdown options
  filterCircleOptions: any[] = [];
  filterDivisionOptions: any[] = [];
  filterSubdivisionOptions: any[] = [];

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
    this.loadCircles();
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
          division: office.division ?? 'N/A',
          officelevel: office.officelevel ?? 'N/A',
          state: office.state ?? 'N/A',
          circle: office.circle ?? 'N/A',
          subdivision: office.subdivision ?? 'N/A',
          email: office.email,
          mobile: office.mobile,
          status_value: office.status,
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
    this.userService.getAllOfficeHierarchy().subscribe({
      next: (response) => {
        const mappedLevels = response.data.map((level: any) => ({
          label: level.name_en,
          value: level.name_en  // use name_en so visibleWhen comparisons work
        }));

        // Store a separate map of name_en -> public_id for submission
        this.officeLevelNameToPublicId = {};
        response.data.forEach((level: any) => {
          this.officeLevelNameToPublicId[level.name_en] = level.public_id;
        });

        const officeLevelField = this.OfficeSchema.fields?.find(f => f.name === 'officelevelcode');
        if (officeLevelField) {
          officeLevelField.options = mappedLevels;
        }
        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to load office levels:', err)
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
          value: String(state.lgdstatecode_enc || state.public_id)
        }));

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
        form?.get('lgdstatecode')?.setValue('');
        this.isLoaded = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading states:', error);
      }
    });
  }



  loadCircles(): void {
    this.userService.getAllCircles().subscribe({
      next: (response) => {
        const mappedCircles = response.data.map((circle: any) => ({
          label: circle.name_en,
          value: circle.public_id
        }));

        const circleField = this.OfficeSchema.fields?.find(f => f.name === 'circle_id');
        if (circleField) {
          circleField.options = mappedCircles;
        }

        const filterCircleField = this.filterSchema.find(f => f.name === 'circle_id');
        if (filterCircleField) {
          filterCircleField.options = mappedCircles;
          this.filterSchema = [...this.filterSchema];
        }

        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to load circles:', err)
    });
  }

  loadDivisions(): void {
    this.userService.getAllDivisions().subscribe({
      next: (response) => {
        const mappedDivisions = response.data.map((div: any) => ({
          label: div.name_en,
          value: div.public_id
        }));

        const divisionField = this.OfficeSchema.fields?.find(f => f.name === 'division_id');
        if (divisionField) {
          divisionField.options = mappedDivisions;
        }
        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to load divisions:', err)
    });
  }

  loadSubDivisions(): void {
    this.userService.getAllSubDivisions().subscribe({
      next: (response) => {
        const mappedSubDivisions = response.data.map((sub: any) => ({
          label: sub.name_en,
          value: sub.public_id
        }));

        const subdivisionField = this.OfficeSchema.fields?.find(f => f.name === 'subdivision_id');
        if (subdivisionField) {
          subdivisionField.options = mappedSubDivisions;
        }
        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to load subdivisions:', err)
    });
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
    //{ key: 'officelevel', label: 'Office Level', widthClass: 'col-2', sortable: false },
    //{ key: 'state', label: 'State', widthClass: 'col-2', sortable: false },
    { key: 'circle', label: 'Circle', widthClass: 'col-2', sortable: false },
    { key: 'division', label: 'Division', widthClass: 'col-2', sortable: false },
    { key: 'subdivision', label: 'Subdivision', widthClass: 'col-2', sortable: false },
    //{ key: 'email', label: 'Email', widthClass: 'col-2', sortable: true },
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
        items: (_row: any) => {
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

    this.formInitialData = {
      en_title: '',
      pa_title: '',
      email: '',
      phonelandline: '',
      mobilenumber: '',
      pincode: '',
      officelevelcode: '',
      circle_id: '',
      division_id: '',
      subdivision_id: '',
      lgdstatecode: '',
      lgddistcode: '',
      status: 'ACTIVE'
    };

    this.modalHelper.openModal({
      modalRef: this.officeModal, 
      schema: this.OfficeSchema,
      submitLabel: 'Create Office',
      patchData: this.formInitialData,
      useRouting: true,        
      route: this.route,
      queryParamId: null,
      onOpen: () => {
        this.setupCascadingDropdowns();
      }
    });
  }


  onModalClosed() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: null },
      queryParamsHandling: 'merge'
    });
  }

  onSubmit(_formData: any){

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

  setupCascadingDropdowns(form?: any) {
    const dynamicForm = form || this.officeModal?.dynamicForm?.form;

    if (!dynamicForm) return;

    const schemaFields = this.OfficeSchema.fields || [];

    this.officeHierarchyService.setupFormCascading(dynamicForm, schemaFields, this.cdr);

    if ((dynamicForm as any)._districtCascadingAttached) {
      return;
    }
    (dynamicForm as any)._districtCascadingAttached = true;

    const districtField = schemaFields.find(f => f.name === 'lgddistcode');

    dynamicForm.get('lgdstatecode')?.valueChanges.subscribe((stateId: string) => {
      if (districtField) {
        districtField.options = [];
        districtField.placeholder = 'Please Select District';
      }
      dynamicForm.patchValue({ lgddistcode: '' }, { emitEvent: false });

      if (stateId) {
        this.userService.getDistrictsByState(stateId, { state_id: stateId }).subscribe({
          next: (res: any) => {
            const districts = res.data || [];
            if (districtField) {
              districtField.options = [
                { label: 'Please select district', value: '' },
                ...districts.map((d: any) => ({
                  label: d.name_en,
                  value: String(d.lgddistcode_enc || d.public_id || d.lgddistcode)
                }))
              ];
            }
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Failed to load districts:', err);
          }
        });
      }
      this.cdr.detectChanges();
    });
  }



  
}
