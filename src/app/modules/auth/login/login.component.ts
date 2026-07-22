
import { AfterViewInit,OnInit, Component, ViewChild,ChangeDetectorRef  } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { FormSchema } from '../../../core/models/form-schema.model';
import { CustomValidators } from '../../../common/validation/custom-validators';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AccessibilityBarComponent  } from '../../../shared/components/accessibility-bar/accessibility-bar.component';
import { TickerComponent  } from '../../../shared/components/ticker/ticker.component';
import { APP_ASSETS } from '../../../core/constants/app-assets';
import { EncryptionService } from '../../../core/services/encrypt.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfigService } from '../../../core/services/config.service';
import { AdminConfig } from '../../../core/models/admin-config.model';

/**
 * LoginComponent
 * -----------------------------------------------------------------------------
 * Implements a professional-grade authentication flow:
 *
 * 1. Username + password + CAPTCHA login
 * 2. OTP verification
 * 3. OTP resend with backend-authoritative cooldown & lockout
 *
 * SECURITY PRINCIPLES:
 * - Backend is the single source of truth
 * - Frontend timers are UX-only
 * - resend_attempts is NEVER trusted from frontend
 * - retry_after is always taken from backend
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, DynamicFormComponent, CommonModule,HeaderComponent,FooterComponent,NavbarComponent,AccessibilityBarComponent,TickerComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  
})
export class LoginComponent implements OnInit,AfterViewInit{

  captchaImage: string | null = null;
  captchaId: string | null = null;
  APP_ASSETS = APP_ASSETS;

   // Admin Captcha configuration flag
   setcaptchaFromAdmin: boolean = true;
  /* --------------------------------------------------------------------------
   * View References
   * ------------------------------------------------------------------------ */
  @ViewChild(DynamicFormComponent)
  dynamicForm!: DynamicFormComponent;
  maskedMobile: string | null = null;

  constructor(
    private auth: AuthService,
    private configService: ConfigService,
    private encryptService: EncryptionService,
    private router: Router,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}
 
ngAfterViewInit(): void {
  this.updateLoginSchema();
}

 ngOnInit(): void {
  this.updateLoginSchema();

  if (this.setcaptchaFromAdmin) {
    this.loadCaptcha();
  }
 }


 loadCaptcha() {

    // Only load CAPTCHA if it's enabled
    if (!this.setcaptchaFromAdmin) {
      // console.log('CAPTCHA is disabled by admin');
      return;
    }

 this.auth.loadCaptcha().subscribe(
  (res: { image: string; captchaId: string }) => {
    // console.log('Captcha Response', res);

    this.captchaImage = res.image;
    this.captchaId = res.captchaId;

    this.cdr.detectChanges();
  }
);
}
  /* --------------------------------------------------------------------------
   * FORM SCHEMAS
   * ------------------------------------------------------------------------ */

  /** Login form schema */
  loginSchema: FormSchema = {
    layoutStyle: 'minimal',   
    submitLabel: 'Log In',
    submitIcon: 'bi bi-box-arrow-in-right ',
    submitClass: 'btn-primary-govt',
    captcha: { enabled: this.setcaptchaFromAdmin },
    forgotPassword: {
    enabled: true,
    text: 'Forgot Password?',
    route: '/auth/forgot-password',
    class: 'text-decoration-none small font_color',
  },
    fields: [      
        {
          name: 'email',
          label: 'Username or Email', 
          type: 'email',
          icon: 'bi bi-person',         
          placeholder: 'Enter username or email', 
          required: true, 
          inputClass: 'pe-5 ps-5 pe-5',       
          validationMessages: {
            required: 'Please enter your email address',
            email: 'Please enter a valid email address'
          },
          validators: [CustomValidators.email()],
          updateOn: 'change'
        },

        {
         name: 'password', 
         label: 'Password',  
         placeholder: 'Enter password',
         icon: 'bi bi-lock',
         required: true, 
         inputClass: 'pe-5 ps-5 pe-5',  
         type: 'password', 
         validators: [CustomValidators.password()],
         updateOn: 'change' 
        }     
    ],
  
  };


loadAdminConfig() {
  this.configService.getConfig().subscribe({
    next: (config: AdminConfig) => {
      this.setcaptchaFromAdmin = config.captchaEnabled;

      this.updateLoginSchema();

      if (this.setcaptchaFromAdmin) {
        this.loadCaptcha();
      }
    },
    error: (err: any) => {
      console.error(err);
    }
  });
}

updateLoginSchema() {
  // Remove existing captcha field
  this.loginSchema.fields =
    this.loginSchema.fields?.filter(
      (field) => field.type !== 'captcha'
    );

  // Add captcha field if enabled
  if (this.setcaptchaFromAdmin) {
    this.loginSchema.fields?.push({
      name: 'captcha_input',
      label: 'Captcha',
      type: 'captcha', // This is valid because fields is FormField[]
      validators: [CustomValidators.captcha()],
      required: true,
      updateOn: 'change'
    });
  }

  this.loginSchema.captcha = {
    enabled: this.setcaptchaFromAdmin
  };
}
  /* --------------------------------------------------------------------------
   * LOGIN SUBMIT
   * ------------------------------------------------------------------------ */
onSubmit(value: any): void {
  const rawValue = this.dynamicForm.form.getRawValue();
  const encryptPassword = this.encryptService.encrypt(rawValue.password);

  this.dynamicForm.setLoading(true);

  const payload = {
    email: rawValue.email,
    password: encryptPassword,
    captcha_input: rawValue.captcha_input,
    captcha_id: this.captchaId
  };

     // Only include CAPTCHA fields if enabled
    if (this.setcaptchaFromAdmin) {
      payload.captcha_input = rawValue.captcha_input;
      payload.captcha_id = this.captchaId;
    }
  //  console.log('Login Payload:', payload);

  this.auth.login(payload).subscribe({
    next: (response: any) => {
      this.dynamicForm.setLoading(false);
      
      
      this.toast.show('success', response?.message || 'Login successful');      
    
        // Clear sensitive fields
        this.dynamicForm.form.patchValue({ password: '' });
        if (this.setcaptchaFromAdmin) {
          this.dynamicForm.form.patchValue({ captcha_input: '' });
        }
      
      this.router.navigateByUrl(this.auth.getDashboardRoute());
    },
  error: (error: any) => {
  this.dynamicForm.setLoading(false);

  // console.error('Error details:', error.error);

  let errorMessage = 'Login failed. Please try again';
  const message = (error.error?.message || '').toLowerCase();

  if (error.status === 401) {

  // console.error('Error details 401==:', error.error);
  
    errorMessage = error.error?.message || 'Invalid credentials, This account is not registered.';

    this.toast.show('error', errorMessage);

    this.dynamicForm.form.patchValue({
      password: '',
      captcha_input: ''
    }); 
     this.loadCaptcha();
  }

  else if (error.status === 400) {

    const isCaptchaError =
      message.includes('captcha') || message.includes('expired');

    if (isCaptchaError) {
      errorMessage = 'CAPTCHA expired. Please try again.';
      this.loadCaptcha();
    } else {
      errorMessage = error.error?.message || 'Invalid request';
      this.loadCaptcha();
    }

    this.toast.show('error', errorMessage, 3000);

    this.dynamicForm.form.patchValue({
      captcha_input: ''
    });
  }

  else if (error.status === 429) {
    errorMessage =
      error.error?.message || 'Too many login attempts. Please try again later.';

    this.toast.show('error', errorMessage, 3000);
    this.loadCaptcha();
  }

  else {
    errorMessage =
      error.error?.message || error.message || 'An unexpected error occurred';
  console.error('Error details status==:', error.error);

    this.toast.show('error', errorMessage, 3000);
    
    this.loadCaptcha();

    this.dynamicForm.form.patchValue({
      captcha_input: ''
    });
  }
}
 
  });
}


}

