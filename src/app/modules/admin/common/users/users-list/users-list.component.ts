import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
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

  data: User[] = [];
  formInitialData: any = {};
  allRolesList: any[] = [];

  userSchema = userSchema;
  updateProfileSchema: any;
  updateEmailInitialValue: any = {};
  updatingUserId: string | null = null;


  profileInitialData: any = {};
  isProfileLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

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

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

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

  tableColumns: TableColumn[] = [
    { key: 'hrmscode', label: 'HRMS Code', widthClass: 'col-1', sortable: true },
    { key: 'name', label: 'Name', widthClass: 'col-2', sortable: true },
    { key: 'email', label: 'Email', widthClass: 'col-2', sortable: true },
    { key: 'userRole', label: 'User Role', widthClass: 'col-2', sortable: false },
    { key: 'office', label: 'Office', widthClass: 'col-1', sortable: false },
    { key: 'created_at', label: 'Created At', widthClass: 'col-1', sortable: true },
    { key: 'unlockUser', type: 'unlock', label: 'Unlock User', widthClass: 'col-1', sortable: false },
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
          label: district.district_english,
          value: district.district_code
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
    this.formInitialData = {
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

  onSubmit(formData: any): void {
    const roleAssignment = formData.role_assignment || { role_id: null, selected_roles: [] };
    const roleId = roleAssignment.role_id;
    const selectedRoles = roleAssignment.selected_roles || [];

    const payload = {
      ...formData,
      role_id: roleId,
      additional_role_ids: selectedRoles,
      password: this.encryptService.encrypt(formData.password),
      password_confirmation: this.encryptService.encrypt(formData.password_confirmation),
    };

    delete payload.role_assignment;

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
  
  handleAction(event: any): void {
    console.log('Action Event:', event);
    if (event.action === 'VIEW' || event.actionName === 'VIEW') {
      this.openViewProfileModal(event.row.id);
    } else if (event.action === 'unlock') {
      this.unlockUser(event.row);
    } else if (event.action === 'UPDATE' || event.actionName === 'UPDATE') {
      this.openUpdateEmailModal(event.row.id);
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
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to unlock user:', err);
        this.toast.show('error', err.error?.message || 'Failed to unlock user');
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

  changePage(page: number) {

    this.loadUsers(page);

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
}