import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../../core/auth/auth.service';
import { User } from '../../../../../core/models/user.model';
import { CustomValidators } from '../../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../../core/services/encrypt.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { userSchema } from './user-form.schema';
import { ModalHelperService } from '../../../../../shared/services/modal-helper';
import { DynamicFilterComponent, FilterField } from '../../../../../shared/components/dynamic-filter/dynamic-filter.component';
import { OfficeHierarchyService } from '../../../../../core/services/office-hierarchy.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DocumentListComponent, ModalFormComponent, CommonModule, FormsModule, DynamicFilterComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class Users implements OnInit {
  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild('createUserModal') userModal!: ModalFormComponent;
  @ViewChild('viewProfileModal') viewProfileModal!: ModalFormComponent;
  @ViewChild('updateEmailModal') updateEmailModal!: ModalFormComponent;
  
  private encryptService = inject(EncryptionService);
  private toast = inject(ToastService);
  // private router = inject(Router);
  private modalHelper = inject(ModalHelperService);
  private officeHierarchyService = inject(OfficeHierarchyService);

  data: User[] = [];
  formInitialData: any = {};
  allRolesList: any[] = [];

  userSchema = userSchema;
  updateProfileSchema: any;
  updateEmailInitialValue: any = {};
  updatingUserId: string | null = null;

isEditMode: boolean = false;
editingUserId: string | null = null;
officeLevelNameToPublicId: Record<string, string> = {};


  profileInitialData: any = {};
  isProfileLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  // Filter state
  filterCircleId = '';
  filterDivisionId = '';
  filterSubdivisionId = '';
  filterOfficecode = '';
  filterRoleId = '';

  filterSchema: FilterField[] = [
    { name: 'circle_id', label: 'Circle', type: 'select', options: [] },
    { name: 'division_id', label: 'Division', type: 'select', options: [], disabled: true },
    { name: 'subdivision_id', label: 'Sub Division', type: 'select', options: [], disabled: true },
    { name: 'officecode', label: 'Office', type: 'select', options: [], disabled: true },
    { name: 'role_id', label: 'Filter By Role', type: 'select', options: [] },
  ];

  // Filter dropdown options
  filterCircleOptions: any[] = [];
  filterDivisionOptions: any[] = [];
  filterSubdivisionOptions: any[] = [];
  filterOfficeOptions: any[] = [];
  filterRoleOptions: any[] = [];

  viewProfileSchema: any = {
    layoutStyle: 'popup',
    fields: [
      {
        type: 'radio',
        name: 'applicantType',
        label: 'Applicant Type',
        disabled: true,
        className: 'col-12 mb-2 pb-3 border-bottom',
        options: [
          { label: 'Self/Owner', value: '1' },
          { label: 'Authorized Applicant', value: '2' }
        ]
      },
      {
        type: 'text',
        name: 'firstName',
        label: "Applicant's First Name",
        placeholder: "First Name",
        className: 'col-md-4',
        disabled: true
      },
      {
        type: 'text',
        name: 'middleName',
        label: "Applicant's Middle Name",
        placeholder: "Middle Name",
        className: 'col-md-4',
        disabled: true
      },
      {
        type: 'text',
        name: 'lastName',
        label: "Applicant's Last Name",
        placeholder: "Last Name",
        className: 'col-md-4',
        disabled: true
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email Address',
        className: 'col-md-6',
        disabled: true
      },
      {
        type: 'text',
        name: 'mobileNumber',
        label: 'Mobile Number',
        className: 'col-md-6',
        disabled: true
      },
      {
        type: 'text',
        name: 'designation',
        label: "Applicant's Designation",
        placeholder: "Designation",
        className: 'col-12',
        disabled: true
      },
      {
        type: 'select',
        name: 'idProof',
        label: 'ID Proof Type',
        className: 'col-md-6',
        options: [
          { label: 'PAN', value: 'PAN' },
          { label: 'Valid Driving License', value: 'DL' }
        ],
        disabled: true
      },
      {
        type: 'text',
        name: 'idProofNumber',
        label: 'ID Proof Number',
        className: 'col-md-6',
        disabled: true
      },
      {
        type: 'file',
        name: 'idProofFile',
        label: 'Copy of ID Proof',
        className: 'col-12 mt-4',
        disabled: true
      }
    ],
    showCustomButtons: true,
    buttons: [
      {
        type: 'button',
        label: 'Submit',
        visible: false,
        action: 'submit'
      }
    ]
  };

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadDistricts();
    this.loadCircles();
    this.loadOfficeLevels();
    this.loadOffices();
    this.initUpdateEmailSchema();
  }

  initUpdateEmailSchema(): void {
    this.updateProfileSchema = {
      layoutStyle: 'popup',
      fields: [
        {
          type: 'html',
          name: 'applicantDetailHtml',
          html: ''
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email Address',
          className: 'col-md-6',
          required: true
        },
        {
          type: 'text',
          name: 'mobileNumber',
          label: 'Phone Number',
          className: 'col-md-6',
          required: true,
          validators: [CustomValidators.phone10()]
        },
        {
          type: 'file',
          name: 'attachment',
          label: 'Upload Pdf',
          className: 'col-12 mt-3',
          required: false
        },
        {
          type: 'html',
          name: 'logsHtml',
          html: ''
        }
      ],
      showCustomButtons: true,
      buttons: [
        {
          type: 'submit',
          label: 'Submit',
          class: 'btn-primary shadow-none'
        }
      ]
    };
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

  loadUsers(page: number = this.currentPage): void {

    this.currentPage = page;

    const params: any = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection,
    };
    
    if (this.filterCircleId) params.circle_id = this.filterCircleId;
    if (this.filterDivisionId) params.division_id = this.filterDivisionId;
    if (this.filterSubdivisionId) params.subdivision_id = this.filterSubdivisionId;
    if (this.filterOfficecode) params.officecode = this.filterOfficecode;
    if (this.filterRoleId) params.role_id = this.filterRoleId;

    this.userService.getUsers(params).subscribe({

      next: (response) => {

        this.data = response.data.map((user: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          hrmscode: user.hrmscode,
          id: user.public_id,
          name: user.name,
          email: user.email,
          userRole: user.role,
          office: user.office,
          created_at: this.formatDate(user.created_at),
          unlockUser: '',
          locked: user.locked,
          status:
            user.status === true ||
            String(user.status) === 'true'
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

  applyFilter(): void {
    this.loadUsers(1);
  }

  resetFilter(): void {
    this.filterCircleId = '';
    this.filterDivisionId = '';
    this.filterSubdivisionId = '';
    this.filterOfficecode = '';
    this.filterRoleId = '';
    this.search = '';
    
    // Reset schema states
    this.filterSchema.find(f => f.name === 'division_id')!.disabled = true;
    this.filterSchema.find(f => f.name === 'division_id')!.options = [];
    this.filterSchema.find(f => f.name === 'subdivision_id')!.disabled = true;
    this.filterSchema.find(f => f.name === 'subdivision_id')!.options = [];
    this.filterSchema.find(f => f.name === 'officecode')!.disabled = true;
    this.filterSchema.find(f => f.name === 'officecode')!.options = [];

    this.loadUsers(1);
  }

  onFilter(values: Record<string, any>) {
    this.filterCircleId = values['circle_id'] || '';
    this.filterDivisionId = values['division_id'] || '';
    this.filterSubdivisionId = values['subdivision_id'] || '';
    this.filterOfficecode = values['officecode'] || '';
    this.filterRoleId = values['role_id'] || '';
    this.loadUsers(1);
  }

  onFilterFieldChange(event: { name: string; value: any }) {
    if (event.name === 'circle_id') {
      this.onFilterCircleChange(event.value);
    } else if (event.name === 'division_id') {
      this.onFilterDivisionChange(event.value);
    } else if (event.name === 'subdivision_id') {
      this.onFilterSubdivisionChange(event.value);
    } else if (event.name === 'officecode') {
      this.filterOfficecode = event.value;
    } else if (event.name === 'role_id') {
      this.filterRoleId = event.value;
    }
  }

  onFilterCircleChange(circleId: string): void {
    this.filterCircleId = circleId;
    this.filterDivisionId = '';
    this.filterSubdivisionId = '';
    this.filterOfficecode = '';
    
    const divField = this.filterSchema.find(f => f.name === 'division_id')!;
    const subdivField = this.filterSchema.find(f => f.name === 'subdivision_id')!;
    const offField = this.filterSchema.find(f => f.name === 'officecode')!;

    divField.options = [];
    divField.disabled = true;
    subdivField.options = [];
    subdivField.disabled = true;
    offField.options = [];
    offField.disabled = true;

    if (circleId) {
      this.userService.getDivisionsByCircle(circleId).subscribe(res => {
        divField.options = res.data.map((d: any) => ({ label: d.name_en, value: d.public_id }));
        divField.disabled = false;
        this.filterSchema = [...this.filterSchema];
        this.cdr.detectChanges();
      });
    } else {
      this.filterSchema = [...this.filterSchema];
    }
  }

  onFilterDivisionChange(divisionId: string): void {
    this.filterDivisionId = divisionId;
    this.filterSubdivisionId = '';
    this.filterOfficecode = '';
    
    const subdivField = this.filterSchema.find(f => f.name === 'subdivision_id')!;
    const offField = this.filterSchema.find(f => f.name === 'officecode')!;

    subdivField.options = [];
    subdivField.disabled = true;
    offField.options = [];
    offField.disabled = true;

    if (divisionId) {
      this.userService.getSubdivisionsByDivision(divisionId).subscribe(res => {
        subdivField.options = res.data.map((s: any) => ({ label: s.name_en, value: s.public_id }));
        subdivField.disabled = false;
        this.filterSchema = [...this.filterSchema];
        this.cdr.detectChanges();
      });
    } else {
      this.filterSchema = [...this.filterSchema];
    }
  }

  onFilterSubdivisionChange(subdivisionId: string): void {
    this.filterSubdivisionId = subdivisionId;
    this.filterOfficecode = '';
    
    const offField = this.filterSchema.find(f => f.name === 'officecode')!;
    offField.options = [];
    offField.disabled = true;

    if (subdivisionId) {
      this.userService.getOfficesByHierarchy(subdivisionId).subscribe(res => {
        offField.options = res.data.map((o: any) => ({ label: o.name_en, value: o.public_id }));
        offField.disabled = false;
        this.filterSchema = [...this.filterSchema];
        this.cdr.detectChanges();
      });
    } else {
      this.filterSchema = [...this.filterSchema];
    }
  }



  tableColumns: TableColumn[] = [
    { key: 'hrmscode', label: 'HRMS Code', widthClass: 'col-1', sortable: true },
    { key: 'name', label: 'Name', widthClass: 'col-1', sortable: true },
    { key: 'email', label: 'Email', widthClass: 'col-1', sortable: true },
    { key: 'userRole', label: 'User Role', widthClass: 'col-1', sortable: false },
    { key: 'office', label: 'Office', widthClass: 'col-1', sortable: false },
    { key: 'created_at', label: 'Created At', widthClass: 'col-1', sortable: true },
    { key: 'unlockUser', type: 'unlock', label: 'Status', widthClass: 'col-1', sortable: false },
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
            { label: 'Delete', actionName: 'delete', class: 'text-danger' }
          ];
          return actions;
          
        }
      }
    }
  ];

  loadRoles(): void {
    this.userService.getRoles({}).subscribe({
      next: (response) => {
        this.allRolesList = response.data.flatMap((cat: any) => 
          (cat.roles || []).map((role: any) => ({
            label: role.name,
            value: role.public_id
          }))
        );

        const rolesField = this.userSchema.steps?.[1]?.fields?.find(f => f.name === 'role_assignment');
        if (rolesField) {
          rolesField.options = response.data;
        }

        // Populate filter schema role options
        const filterRoleField = this.filterSchema.find(f => f.name === 'role_id');
        if (filterRoleField) {
          filterRoleField.options = this.allRolesList;
          this.filterSchema = [...this.filterSchema];
        }

        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to load roles:', err);
      }
    });
  }

  loadDistricts(): void {
    this.userService.getDistricts().subscribe({
      next: (response) => {
        const mappedDistricts = response.data.map((district: any) => ({
          label: district.name_en,
          value: district.lgddistcode  
        }));

        const districtField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'district_code');
        if (districtField) {
          districtField.options = mappedDistricts;
        }
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to load districts:', err);
      }
    });
  }

  openCreateModal() {
     this.isEditMode = false;  
      this.editingUserId = null;  
      
      // Make password required for create
      const passField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'password');
      if (passField) passField.required = true;
      const confirmPassField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'password_confirmation');
      if (confirmPassField) confirmPassField.required = true;
      
      // Trigger change detection for dynamic form
      this.userSchema = { ...this.userSchema };

    this.formInitialData = {
      district_code: '',
      officelevelcode: '',
      circle_id: '',      
      division_id: '',    
      subdivision_id: '', 
      officecode: '',  
      status: 'ACTIVE',
      password: '',
      password_confirmation: '',
      role_assignment: { role_id: null, selected_roles: [] }
    };
    this.modalHelper.openModal({
      modalRef: this.userModal,
      schema: this.userSchema, 
      submitLabel: 'Create User',
      patchData: this.formInitialData,
      useRouting: false
    });
  }
  openEditModal(userId: string): void {
  this.isEditMode = true;
  this.editingUserId = userId;

  // Make password optional for edit
  const passField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'password');
  if (passField) passField.required = false;
  const confirmPassField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'password_confirmation');
  if (confirmPassField) confirmPassField.required = false;

  // Trigger change detection for dynamic form
  this.userSchema = { ...this.userSchema };

  this.userService.getUserByPublicId(userId).subscribe({
    next: (res) => {
      const user = res.data;

     // Translate the public_id back to name_en for dropdown matching
  const officeLevelName = Object.entries(this.officeLevelNameToPublicId)
    .find(([name, pid]) => pid === user.officelevelcode)?.[0] || user.officelevelcode || '';

      // Map the backend role names to the non-deterministic encrypted IDs currently stored in allRolesList (which feeds the form)
      const userMainRoleOption = this.allRolesList.find((o: any) => o.label === user.role);
      const mainRoleId = userMainRoleOption ? userMainRoleOption.value : null;

      const selectedRoleIds = (user.selected_roles_names || []).map((name: string) => {
          const opt = this.allRolesList.find((o: any) => o.label === name);
          return opt ? opt.value : null;
      }).filter((v: any) => v !== null);

  this.formInitialData = {
  hrmscode:        user.hrmscode || '',
  name:            user.name || '',
  email:           user.email || '',
  mobile_number:   user.mobileNumber || '',
  retirementdate:  user.retirementdate || '',
  officelevelcode: officeLevelName,
  officecode:      user.officecode || '',
  district_code:   user.district_code || '',
  circle_id:       user.circle_id || '',
  division_id:     user.division_id || '',
  subdivision_id:  user.subdivision_id || '',
  status:          user.status === true ? 'ACTIVE' : 'INACTIVE',
  password:        '',
  password_confirmation: '',
  role_assignment: { 
    role_id: mainRoleId, 
    selected_roles: selectedRoleIds 
  }
};


      this.modalHelper.openModal({
        modalRef: this.userModal,
        schema: this.userSchema,
        submitLabel: 'Update User',  // changes the button label
        patchData: this.formInitialData,
        useRouting: false
      });
    },
    error: (err) => {
      this.toast.show('error', 'Failed to load user data.');
    }
  });
}


  onSubmit(formData: any): void {
    const roleAssignment = formData.role_assignment || { role_id: null, selected_roles: [] };
    const roleId = roleAssignment.role_id;
    const selectedRoles = roleAssignment.selected_roles || [];
       // Split the single "name" field into first_name and last_name for the backend
    const nameParts = (formData.name || '').trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User'; // Fallback if they only type one word

      const payload = {
      ...formData,
      first_name: firstName,
      last_name: lastName,
      status: formData.status === 'ACTIVE',
      district_code: formData.district_code || 1, 
      role_id: roleId,
      additional_role_ids: selectedRoles,
      // Translate office level name back to public_id for the backend
      officelevelcode: this.officeLevelNameToPublicId[formData.officelevelcode] || formData.officelevelcode,
      password: this.encryptService.encrypt(formData.password),
      password_confirmation: this.encryptService.encrypt(formData.password_confirmation),
    };
    delete payload.name; 
    delete payload.role_assignment; 
      if (this.isEditMode && this.editingUserId) {
    // EDIT MODE
    this.userService.editUser(this.editingUserId, payload).subscribe({
      next: (res: any) => {
        this.toast.show('success', 'User updated successfully!', 4000);
        this.userModal.close();
        this.isEditMode = false;
        this.editingUserId = null;
        this.loadUsers();
      },
      error: (error: any) => {
        this.toast.show('error', error.error?.message || 'Failed to update user');
      }
    });
  } else {

    this.userService.createUser(payload).subscribe({
      next: (res: any) => {
        this.toast.show('success', res.message || 'User created successfully!', 4000);
        this.userModal.close();
        this.loadUsers();
      },
      error: (error: any) => {
        this.toast.show('error', error.error?.message || 'Failed to create user');
        console.error('Failed to create user:', error);
      }
    
    });
  }
  }
  
  handleAction(event: any): void {
    if (event.action === 'VIEW' || event.actionName === 'VIEW') {
      this.openViewProfileModal(event.row.id);
    } else if (event.action === 'unlock') {
      this.unlockUser(event.row);
    } else if (event.action === 'lock') {
      this.lockUser(event.row);
    } else if (event.action === 'UPDATE' || event.actionName === 'UPDATE') {
      this.openUpdateEmailModal(event.row.id);
    } else if (event.action === 'edit' || event.actionName === 'edit') {
      this.openEditModal(event.row.id);
    } else if (event.action === 'delete' || event.actionName === 'delete') {
      if (confirm('Are you sure you want to delete this user?')) {
        this.userService.deleteUser(event.row.id).subscribe({
          next: () => {
            this.toast.show('success', 'User has been deleted successfully.', 4000);
            this.loadUsers();
          },
          error: (err: any) => {
            this.toast.show('error', err.error?.message || 'Failed to delete user.');
          }
        });
      }
    }
  }

  openUpdateEmailModal(userId: string): void {
    this.updatingUserId = userId;
    this.updateEmailInitialValue = {};
    if (this.updateEmailModal?.dynamicForm) {
      this.updateEmailModal.dynamicForm.form.reset();
    }

    this.updateProfileSchema.fields.find((f: any) => f.name === 'applicantDetailHtml').html = '<div class="text-center py-3"><div class="spinner-border spinner-border-sm text-primary"></div> Loading...</div>';
    this.updateProfileSchema.fields.find((f: any) => f.name === 'logsHtml').html = '';

    this.updateEmailModal.open();

    this.userService.getUserByPublicId(userId).subscribe({
      next: (res) => {
        if (res.data) {
          const profile = res.data;
          const detailsHtml = "test";
          this.updateProfileSchema.fields.find((f: any) => f.name === 'applicantDetailHtml').html = detailsHtml;

          this.updateEmailInitialValue = {
            email: profile.email,
            mobileNumber: profile.mobileNumber
          };

          // Fetch previous logs
          this.userService.getEmailAndPhoneLogs(userId).subscribe({
            next: (resLogs) => {
              const logs = resLogs.data || [];
              const logsHtml = "test";
              this.updateProfileSchema.fields.find((f: any) => f.name === 'logsHtml').html = logsHtml;
              this.cdr.detectChanges();
            }
          });

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
        this.toast.show('error', 'Failed to load profile details.');
      }
    });
  }

  onUpdateEmailSubmit(formData: any): void {
    if (!this.updatingUserId) return;

    const payload = new FormData();
    payload.append('email', formData.email);
    payload.append('mobile_number', formData.mobileNumber);
    if (formData.attachment instanceof File) {
      payload.append('attachment', formData.attachment);
    }

    this.userService.updateEmailAndPhone(this.updatingUserId, payload).subscribe({
      next: (res) => {
        this.toast.show('success', 'User email and phone updated successfully!', 4000);
        this.updateEmailModal.close();
        
        // Refresh grid list
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to update email/phone:', err);
        this.toast.show('error', err.error?.message || 'Failed to update email and phone');
      }
    });
  }

  unlockUser(row: any): void {
    if (row.status !== false) return;

    this.userService.updateUser(row.id, { status: true }).subscribe({
      next: (res) => {
        this.toast.show('success', 'User unlocked successfully!', 4000);
        this.loadUsers(this.currentPage);
      },
      error: (err) => {
        console.error('Failed to unlock user:', err);
        this.toast.show('error', err.error?.message || 'Failed to unlock user');
      }
    });
  }

  lockUser(row: any): void {
    if (row.status === false) return;

    this.userService.updateUser(row.id, { status: false }).subscribe({
      next: (res) => {
        this.toast.show('success', 'User locked successfully!', 4000);
        this.loadUsers(this.currentPage);
      },
      error: (err) => {
        console.error('Failed to lock user:', err);
        this.toast.show('error', err.error?.message || 'Failed to lock user');
      }
    });
  }

  openViewProfileModal(userId: string) {
    this.profileInitialData = {};
    if (this.viewProfileModal?.dynamicForm) {
      this.viewProfileModal.dynamicForm.form.reset();
    }
    this.isProfileLoading = true;
    this.viewProfileModal.open();

    this.userService.getUserByPublicId(userId).subscribe({
      next: (res) => {
        this.isProfileLoading = false;
        if (res.data) { 
          const profile = res.data;

          const initials = (profile.first_name || 'U').charAt(0).toUpperCase();
          const email = profile.email || '';
          const fullName = (profile.first_name || profile.last_name)
            ? `${profile.first_name || ''} ${profile.middle_name ? profile.middle_name + ' ' : ''}${profile.last_name || ''}`.trim()
            : (profile.name || '');
          
          const avatarHtml = `
            <div class="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom border-light-subtle lh-1 mt-0 px-2 pt-0 ">
              <div class="bg-primary btn_circle p-3 text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm lh-1 avatar-circle fw-bold fs-4">
                ${initials}
              </div>
              <div>
                <h5 class="fs-5 fw-bold text-dark mb-0">
                  ${fullName}
                </h5>
                <p class="text-secondary small mb-0 mt-1 fw-medium">
                  <i class="bi bi-envelope me-1"></i> ${email}
                </p>
              </div>
            </div>
          `;
          
          const hasAvatar = this.viewProfileSchema.fields.some((f: any) => f.name === 'avatarHeader');
          if (hasAvatar) {
            this.viewProfileSchema.fields[0].html = avatarHtml;
          } else {
            this.viewProfileSchema.fields.unshift({
              type: 'html',
              name: 'avatarHeader',
              html: avatarHtml
            });
          }
          
          if (!profile.applicant_type) {
            this.viewProfileSchema = {
              ...this.viewProfileSchema,
              fields: this.viewProfileSchema.fields.filter((f: any) => f.name !== 'applicantType')
            };
          } else {
            const hasAppType = this.viewProfileSchema.fields.some((f: any) => f.name === 'applicantType');
            if (!hasAppType) {
              this.viewProfileSchema = {
                ...this.viewProfileSchema,
                fields: [
                  this.viewProfileSchema.fields[0], 
                  {
                    type: 'radio',
                    name: 'applicantType',
                    label: 'Applicant Type',
                    disabled: true,
                    className: 'col-12 mb-2 pb-3 border-bottom',
                    options: [
                      { label: 'Self/Owner', value: '1' },
                      { label: 'Authorized Applicant', value: '2' }
                    ]
                  },
                  ...this.viewProfileSchema.fields.slice(1)
                ]
              };
            }
          }

          this.profileInitialData = {
            applicantType: profile.applicant_type ? String(profile.applicant_type) : '',
            firstName: profile.first_name || '',
            middleName: profile.middle_name || '',
            lastName: profile.last_name || '',
            email: profile.email || '',
            mobileNumber: profile.mobileNumber || '',
            designation: profile.designation || '',
            idProof: (() => {
              const proof = profile.proof_type || profile.id_proof_type || '';
              const proofStr = String(proof).trim().toUpperCase();
              if (proofStr === 'PAN CARD' || proofStr === '1' || proofStr === 'PAN') return 'PAN';
              if (proofStr === 'DRIVING LICENSE' || proofStr === '2' || proofStr === 'DL') return 'DL';
              return proofStr;
            })(),
            idProofNumber: profile.proof_number || profile.id_proof_number || '',
            idProofFile: profile.id_proof_file_name ? { fileName: profile.id_proof_file_name } : null
          };

          setTimeout(() => {
            if (this.viewProfileModal?.dynamicForm) {
              this.viewProfileModal.dynamicForm.form.reset(this.profileInitialData);
              this.viewProfileModal.dynamicForm.form.patchValue(this.profileInitialData);
              this.cdr.detectChanges();
            }
          }, 100);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isProfileLoading = false;
        console.error("API Error:", err);
        this.toast.show('error', 'Failed to load user profile');
        this.viewProfileModal.close();
        this.cdr.detectChanges();
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

        const circleField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'circle_id');
        if (circleField) {
          circleField.options = mappedCircles;
        }

        // Populate filter schema circle options
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

        const divisionField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'division_id');
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

        const subdivisionField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'subdivision_id');
        if (subdivisionField) {
          subdivisionField.options = mappedSubDivisions;
        }
        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to load subdivisions:', err)
    });
  }

  loadOfficeLevels(): void {
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

        const officeLevelField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'officelevelcode');
        if (officeLevelField) {
          officeLevelField.options = mappedLevels;
        }
        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to load office levels:', err)
    });
  }

  loadOffices(): void {
    this.userService.getOffices().subscribe({
      next: (response) => {
        const mappedOffices = response.data.map((office: any) => ({
          label: office.name_en,
          value: office.public_id 
        }));

        const officeField = this.userSchema.steps?.[0]?.fields?.find(f => f.name === 'officecode');
        if (officeField) {
          officeField.options = mappedOffices;
        }
        this.cdr.detectChanges();
      },
      error: err => console.error('Failed to load offices:', err)
    });
  }


  changePage(page: number) {

    this.loadUsers(page);

  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.loadUsers(1);
  }

  searchUsers(text: string) {
    this.search = text;

    this.loadUsers(1);

  }

  sortUsers(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadUsers(1);

  }
  
    setupCascadingDropdowns(form?: any) {
    // We can accept the form from the (formReady) event directly,
    // or fallback to the one in the modal view child if undefined.
    const dynamicForm = form || this.userModal?.dynamicForm?.form;
    
    if (dynamicForm) {
      const schemaFields = this.userSchema.steps?.[0]?.fields || [];
      this.officeHierarchyService.setupFormCascading(dynamicForm, schemaFields, this.cdr);
    }   
  }

}