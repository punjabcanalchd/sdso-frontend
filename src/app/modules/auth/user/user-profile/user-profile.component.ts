import { Component, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import { AuthService } from '../../../../core/auth/auth.service';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ToastService } from '../../../../shared/services/toast.service';
// import * as CryptoJS from 'crypto-js';
// import { JSEncrypt } from 'jsencrypt';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { CryptoService } from '../../../../core/services/crypto.service';




@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DynamicFormComponent,
    ModalFormComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})



export class UserProfileComponent {
  @ViewChild(ModalFormComponent) passwordModal!: ModalFormComponent;

  isPasswordLoading: boolean = false;

  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  public authService = inject(AuthService);
  private encryptionService = inject(EncryptionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cryptoService = inject(CryptoService);


  isViewMode: boolean = false;
  displayName: string = '';
  displayEmail: string = '';
  userData: any = {};
  isProfileLoaded: boolean = false;
  editProfileSchema: any = {
    layoutStyle: 'compact',
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
           min:2,
          max:50,
        label: "Applicant's First Name",
        placeholder: "First Name",
        className: 'col-md-4',
        required: true,
        validators: [CustomValidators.shortAlpha()]
      },
      {
        type: 'text',
        name: 'middleName',
           min:2,
          max:50,
        label: "Applicant's Middle Name",
        placeholder: "Middle Name",
        className: 'col-md-4',
        validators: [CustomValidators.shortAlpha()]
      },
      {
        type: 'text',
        name: 'lastName',
           min:2,
          max:50,
        label: "Applicant's Last Name",
        placeholder: "Last Name",
        className: 'col-md-4',
        required: true,
        validators: [CustomValidators.shortAlpha()]
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email Address',
        className: 'col-md-6',
        readOnly: true,
        disabled: true,
        validationMessages: {
          required: 'Please enter your email address',
          email: 'Please enter a valid email address'
        },
        validators: [CustomValidators.email()],
      },
      {
        type: 'text',
        name: 'mobileNumber',
        label: 'Mobile Number',
        className: 'col-md-6',
        required: true,
        disabled: false,
        max: 10,
        min: 10,
        validationMessages: {
          required: 'Please enter your contact number',
          phone: 'Please enter a valid contact number',
          validationMessage: 'Please enter a valid 10-digit contact number'
        },
        validators: [
          CustomValidators.phone10(),
        ],
      },
      {
        type: 'text',
        name: 'designation',
        label: "Applicant's Designation",
        placeholder: "Designation",
        className: 'col-12',
        readOnly: true,
        disabled: true,
        validators: [CustomValidators.shortAlpha()]
      },
      {
        type: 'select',
        name: 'idProof',
        label: 'ID Proof Type',
        className: 'col-md-6 ',
        required: false,
        options: [
          { label: 'PAN', value: 'PAN' },
          { label: 'Valid Driving License', value: 'DL' }
        ],
        readOnly: true,
        disabled: true,
      },
      {
        type: 'text',
        name: 'idProofNumber',
        label: 'ID Proof Number',
        className: 'col-md-6 ',
        required: false,
        maskOnBlur: true,
        validators: [
          maskedIdProofValidator()
        ],
        readOnly: true,
        disabled: true,
      },
      {
        type: 'file',
        readOnly: true,
        name: 'idProofFile',
        label: 'Upload Copy of ID Proof',
        className: 'col-12 mt-4',
        required: false,
        validators: [
          CustomValidators.fileTypes(['pdf'])
        ],
        validationMessages: {
          validationMessage: 'Only PDF files are allowed'
        },

      }
    ],
    showCustomButtons: true,
    buttons: [
      {
        type: 'button',
        label: 'Save Profile Changes',
        class: 'btn btn-primary-govt  me-3 px-4',
        action: 'saveProfile'
      },
      {
        type: 'button',
        label: 'Change Password',
        class: 'btn btn-outline-secondary px-4',
        action: 'changePassword',
        ignoreFormValidation: true
      }
    ]


  };
  passwordSchema: any = {
    layoutStyle: 'popup',
    fields: [
      {
        type: 'password',
         name: 'old_password',
         min: 8,
         max: 50,
          label: 'Current Password',
        className: 'col-12 mb-4',
        inputClass: 'ps-5 pe-5',
         icon: 'bi bi-key',
          placeholder: 'Enter current password',
            validators: [CustomValidators.password()],
        required: true,
         updateOn: 'change'
      },
      {
        type: 'password',
         name: 'new_password',
         min: 8,
         max: 50,
          label: 'New Password',
        className: 'col-12 mb-3',
        inputClass: 'ps-5 pe-5',
         icon: 'bi bi-lock',
          placeholder: 'Create new password',
        required: true,
         validators: [CustomValidators.password()],
          updateOn: 'change'
      },
      {
        type: 'password',
         name: 'confirm_password',
         min: 8,
         max: 50,
          label: 'Confirm New Password',
        className: 'col-12 mb-3',
        inputClass: 'ps-5 pe-5',
         icon: 'bi bi-lock-fill', 
         placeholder: 'Confirm new password',
        required: true, 
        validators: [CustomValidators.password(),
           CustomValidators.matchPassword('new_password')],
        updateOn: 'change'
      }
    ],
    showCustomButtons: true,
    buttons: [
      {
        type: 'button', label: 'Update Password',
        class: 'btn btn-primary-govt w-100', action: 'submitPasswordChange'
      }
    ]
  };


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.isViewMode = true;
        this.loadUserProfileById(userId);
      } else {
        this.isViewMode = false;
        this.loadOwnProfile();
      }
    });
  }

  resetSchemaToDefault() {
    this.editProfileSchema.showCustomButtons = true;
    this.editProfileSchema.fields = this.editProfileSchema.fields.map((f: any) => {
      const isDisabledDefault = ['applicantType', 'email', 'designation', 'idProof', 'idProofNumber'].includes(f.name);
      return {
        ...f,
        disabled: isDisabledDefault,
        required: ['firstName', 'lastName', 'mobileNumber'].includes(f.name)
      };
    });
  }

  loadOwnProfile() {
    this.isProfileLoaded = false;
    this.resetSchemaToDefault();

    this.authService.user$.subscribe(user => {
      if (user && !this.isViewMode) {
        this.userData = { ...this.userData, email: user.email, mobileNumber: user.mobileNumber };
        this.displayName = user.name || '';
        this.displayEmail = user.email || '';
      }
    });

    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.status && res.data) {
          const profile = res.data;
          
          this.displayName = profile.first_name + ' ' + (profile.middle_name ? profile.middle_name + ' ' : '') + profile.last_name;
          this.displayEmail = profile.email || this.userData.email;

          if (!profile.applicant_type) {
            this.editProfileSchema = {
              ...this.editProfileSchema,
              fields: this.editProfileSchema.fields.filter((f: any) => f.name !== 'applicantType')
            };
          }
          this.userData = {
            ...this.userData,
            applicantType: profile.applicant_type ?
              String(profile.applicant_type) : '',
            firstName: profile.first_name || '',
            middleName: profile.middle_name || '',
            lastName: profile.last_name || '',
            email: profile.email || this.userData.email,
            mobileNumber: profile.mobile_number || this.userData.mobileNumber,
            designation: profile.designation || '',
            idProof: (() => {
              const proof = profile.id_proof_type ? String(profile.id_proof_type).trim().toUpperCase() : '';
              if (proof === 'PAN CARD' || proof === '1' || proof === 'PAN') return 'PAN';
              if (proof === 'DRIVING LICENSE' || proof === '2' || proof === 'DL') return 'DL';
              return proof;
            })(),
            idProofNumber: profile.id_proof_number ? CustomValidators.maskIdProof(profile.id_proof_number) : '',
            idProofFile: profile.id_proof_file_name ? { fileName: profile.id_proof_file_name } : null
          };
        }
        this.isProfileLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("API Error:", err);
        this.isProfileLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  loadUserProfileById(userId: string) {
    this.isProfileLoaded = false;
    this.resetSchemaToDefault();

    this.authService.getUserByPublicId(userId).subscribe({
      next: (res) => {
        if (res.data) {
          const profile = res.data;
          
          this.displayName = profile.name || '';
          this.displayEmail = profile.email || '';

          const updatedFields = this.editProfileSchema.fields
            .filter((f: any) => f.name !== 'applicantType' || profile.applicant_type)
            .map((f: any) => ({
              ...f,
              disabled: true,
              required: false
            }));

          this.editProfileSchema = {
            ...this.editProfileSchema,
            fields: updatedFields,
            showCustomButtons: false
          };

          this.userData = {
            applicantType: profile.applicant_type ? String(profile.applicant_type) : '',
            firstName: profile.first_name || '',
            middleName: profile.middle_name || '',
            lastName: profile.last_name || '',
            email: profile.email || '',
            mobileNumber: profile.mobile_number || '',
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
        }
        this.isProfileLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("API Error:", err);
        this.toast.show('error', 'Failed to load user profile');
        this.isProfileLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }


  handleFormEvent(event: any) {

    if (event.action === 'changePassword') {

      this.passwordModal.open();

    } else if (event.action === 'saveProfile') {
      console.log('Updated');



      const payload = new FormData();
      // payload.append('_method', 'PUT');

      payload.append('first_name', event.formValue.firstName || '');
      payload.append('middle_name', event.formValue.middleName || '');
      payload.append('last_name', event.formValue.lastName || '');
      payload.append('designation', event.formValue.designation || '');
      if (!String(event.formValue.idProofNumber).includes('XXX')) {

        const encryptedIdProof = this.encryptionService.encrypt(event.formValue.idProofNumber);

        payload.append('id_proof_number', encryptedIdProof);
        payload.append('id_proof', event.formValue.idProof);
      }

      if (event.formValue.idProofFile) {
        payload.append('upload_copy_of_id_proof', event.formValue.idProofFile);
      }
      this.authService.updateProfile(payload).subscribe({
        next: (res) => {
          this.toast.show('success', res.message || 'Profile updated successfully!', 4000);
        },
        error: (err) => {

          if (err.status === 422) {
            const errors = err.error?.errors;
            if (errors) {
              Object.values(errors).forEach((msgs: any) => {
                this.toast.show('error', Array.isArray(msgs) ? msgs[0] : msgs, 5000);
              });
            }
          } else {
            this.toast.show('error', err.error?.message || 'Failed to update profile', 4000);
          }
        }
      });
    }
  }



  handlePasswordSubmit(event: any) {
    if (event.action === 'submitPasswordChange' && event.formValue) {
      if (event.formValue.new_password !== event.formValue.confirm_password) {
        this.toast.show('warning', 'New passwords do not match!', 3000);
        return;
      }

      this.isPasswordLoading = true;

      const payload = {
        old_password: this.encryptionService.encrypt(event.formValue.old_password),
        new_password: this.encryptionService.encrypt(event.formValue.new_password),
        confirm_password: this.encryptionService.encrypt(event.formValue.confirm_password)
      };

      this.authService.changePassword(payload).subscribe({
        next: (res) => {
          this.isPasswordLoading = false;
          this.toast.show('success', res.message || 'Password changed successfully!', 4000);
          this.passwordModal.close(); // <-- CLOSE ON SUCCESS
        },
        error: (err) => {
          this.isPasswordLoading = false;
          if (err.status === 422 && err.error?.errors) {
            Object.values(err.error.errors).forEach((msgs: any) => {
              this.toast.show('error', Array.isArray(msgs) ? msgs[0] : msgs, 5000);
            });
          } else {
            this.toast.show('error', err.error?.message || 'Failed to change password', 4000);
          }
        }
      });
    }
  }



}


export function maskedIdProofValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value && String(value).includes('XXX')) {
      return null;
    }

    return CustomValidators.idProofValidator()(control);
  };
}


// const encrypted = this.cryptoService.encrypt('123456');
// console.log(encrypted);

// const decrypted = this.cryptoService.decrypt(encrypted);
// console.log(decrypted);