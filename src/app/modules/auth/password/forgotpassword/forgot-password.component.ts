import { Component, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

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



@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DynamicFormComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    AccessibilityBarComponent,
    TickerComponent
  ],

  templateUrl: './forgot-password.component.html',

  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  @ViewChild(DynamicFormComponent)
  dynamicForm!: DynamicFormComponent;

  // private http = inject(HttpClient);
  private api =inject(ApiService);
  private cdr= inject(ChangeDetectorRef);

  APP_ASSETS = APP_ASSETS;

  isLoading: boolean = false;
  successMessage: string | null=null;
  errorMessage: string | null=null;

  /* --------------------------------------------------------------------------
   * FORM SCHEMA
   * ------------------------------------------------------------------------ */

  forgotPasswordSchema: FormSchema = {

    // logoUrl: APP_ASSETS.LOGO,
    layoutStyle: 'minimal',    
    submitLabel: 'Send Reset Link',
    submitIcon: 'bi bi-envelope-paper',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        icon: 'bi bi-envelope',
        placeholder: 'Enter your registered email',
        inputClass: 'pe-5 ps-5 pe-5', 
        required: true,
        validationMessages: {
          required: 'Please enter your email address',
          email: 'Please enter a valid email address'
        },
        validators: [
          CustomValidators.email()
        ],
        updateOn: 'change'
      }
    ],
    footerText:
      'Password reset instructions will be sent securely to your email.'
  };

  /* --------------------------------------------------------------------------
   * SUBMIT
   * ------------------------------------------------------------------------ */

  onSubmit(formData: any): void {
    // API Call Here
   
    this.isLoading=true;
    this.successMessage=null;
    this.errorMessage=null;
    

    this.api.post('/auth/forgotPasswordEmail', {email: formData.email}).subscribe({
        next:(response: any)=>{
          this.isLoading=false;
          this.successMessage=response.message || 'A password reset link has been sent to your email address.';
          this.dynamicForm.form.reset()
          this.cdr.detectChanges();
        },

        error: (error)=>{
          this.isLoading = false;
          if (error.status >= 500) {
            this.errorMessage = 'An unexpected server error occurred. Please try again later.';
          }
          else{
          this.errorMessage=error.error?.message || 'We could not find an account with that email address.'
          }
          this.cdr.detectChanges();
        }
        

    })
    
  }


}