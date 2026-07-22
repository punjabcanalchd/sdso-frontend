import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { APP_ASSETS } from '../../../../core/constants/app-assets';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { AuthService } from '../../../../core/auth/auth.service';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [
    CommonModule, RouterLink, DynamicFormComponent
  ],
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {
  private authService = inject(AuthService);
  private encryptService = inject(EncryptionService);
  private toast = inject(ToastService);
  private router = inject(Router);

  APP_ASSETS = APP_ASSETS;
  isLoading: boolean = false;

  passwordSchema: FormSchema = {
    layoutStyle: 'minimal',
    submitLabel: 'Change Password',
    submitIcon: 'bi bi-check2-circle',
    submitClass: 'btn-primary-govt ',
    fields: [
      {
        type: 'password',
        name: 'old_password',
        label: 'Current Password',
        //  className: 'col-md-8 mx-auto mb-3',
        icon: 'bi bi-key',
        placeholder: 'Enter current password',
        required: true,
        inputClass: 'pe-5 ps-5 pe-5',
        updateOn: 'change',
        // className: 'col-md-9'
      },
      {
        type: 'password',
        name: 'new_password',
        label: 'New Password',
        //  className: 'col-md-8 mx-auto mb-3',
        icon: 'bi bi-lock',
        placeholder: 'Enter new password',
        required: true,
        inputClass: 'pe-5 ps-5 pe-5',
        validators: [CustomValidators.password()],
        updateOn: 'change'
      },
      {
        type: 'password',
        name: 'confirm_password',
        label: 'Confirm New Password',
        //  className: 'col-md-8 mx-auto mb-3',
        icon: 'bi bi-lock-fill',
        placeholder: 'Confirm new password',
        required: true,
        inputClass: 'pe-5 ps-5 pe-5',
        validators: [
          CustomValidators.password(),
          CustomValidators.matchPassword('new_password')
        ],
        updateOn: 'change'
      }
    ],
    footerText: 'Ensure your password is strong and secure.'
  };

  onSubmit(formValue: any) {
    if (formValue.new_password !== formValue.confirm_password) {
      this.toast.show('warning', 'New passwords do not match!', 3000);
      return;
    }

    this.isLoading = true;

    const payload = {
      old_password: this.encryptService.encrypt(formValue.old_password),
      new_password: this.encryptService.encrypt(formValue.new_password),
      confirm_password: this.encryptService.encrypt(formValue.confirm_password)
    };

    this.authService.changePassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toast.show('success', res.message || 'Password changed successfully!', 4000);
        this.router.navigate(['/auth/user-profile']); 
      },
      error: (err) => {
        this.isLoading = false;
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
