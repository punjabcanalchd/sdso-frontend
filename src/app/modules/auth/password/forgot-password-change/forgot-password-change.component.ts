import { Component, ViewChild, inject, ChangeDetectorRef,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

import { APP_ASSETS } from '../../../../core/constants/app-assets';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { AccessibilityBarComponent } from '../../../../shared/components/accessibility-bar/accessibility-bar.component';
import { TickerComponent } from '../../../../shared/components/ticker/ticker.component';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { FormSchema } from '../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ApiService } from '../../../../core/services/api.service';
import { EncryptionService } from '../../../../core/services/encrypt.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule, RouterLink, DynamicFormComponent, HeaderComponent,
    FooterComponent, NavbarComponent, AccessibilityBarComponent, TickerComponent
  ],
  templateUrl: './forgot-password-change.component.html',
  styleUrls: ['./forgot-password-change.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private encryptService= inject(EncryptionService);

  APP_ASSETS = APP_ASSETS;

  // UI States
  hash: string = '';
  isValidating: boolean = true;
  isHashValid: boolean = false;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  /* --------------------------------------------------------------------------
   * FORM SCHEMA
   * ------------------------------------------------------------------------ */
  resetPasswordSchema: FormSchema = {
    layoutStyle: 'minimal',    
    submitLabel: 'Change Password',
    submitIcon: 'bi bi-check2-circle',
    fields: [
      {
        name: 'password',
        label: 'New Password',
        type: 'password',
        icon: 'bi bi-lock',
        placeholder: 'Enter new password',
         inputClass: 'pe-5 ps-5 pe-5',
        required: true,
        validators:[CustomValidators.password()],
        validationMessages: { required: 'Password is required' },
        updateOn: 'change'
      },
      {
        name: 'confirm_password',
        label: 'Confirm Password',
        type: 'password',
        icon: 'bi bi-lock-fill',
        placeholder: 'Confirm new password',
         inputClass: 'pe-5 ps-5 pe-5',
        required: true,
        validators: [CustomValidators.password(),
          CustomValidators.matchPassword('password')
        ],
        validationMessages: { required: 'Please confirm your password' },
        updateOn: 'change'
      }
    ],
    footerText: 'Ensure your password is strong and secure.'
  };

  /* --------------------------------------------------------------------------
   * VALIDATE HASH ON LOAD
   * ------------------------------------------------------------------------ */
  ngOnInit(): void {
    // 1. Grab the hash from the URL
    this.hash = this.route.snapshot.paramMap.get('hash') || '';

    if (!this.hash) {
      this.isValidating = false;
      this.errorMessage = 'Invalid password reset link.';
      return;
    }

    this.api.get(`/auth/validateForgotPasswordHash/${this.hash}`).subscribe({
      next: () => {
        this.isValidating = false;
        this.isHashValid = true; // Show the form!
        this.cdr.detectChanges();
      },
      error: () => {
        this.isValidating = false;
        this.isHashValid = false; // Hide the form, show error!
        this.errorMessage = 'This password reset link has expired or is invalid.';
        this.cdr.detectChanges();
      }
    });
  }

  /* --------------------------------------------------------------------------
   * SUBMIT NEW PASSWORD
   * ------------------------------------------------------------------------ */
  onSubmit(formData: any): void {
    if (formData.password !== formData.confirm_password) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const encryptedPassword= this.encryptService.encrypt(formData.password);
  

    const payload = {
      hash: this.hash,
      password: encryptedPassword,
      confirm_password: encryptedPassword
    };

    this.api.post('/auth/changeForgotPassword', payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Password successfully changed!';
        this.dynamicForm.form.reset();
        
        // Redirect to login after 3 seconds
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status >= 500) {
          this.errorMessage = 'An unexpected server error occurred.';
        } else {
          this.errorMessage = error.error?.message || 'Failed to change password.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}