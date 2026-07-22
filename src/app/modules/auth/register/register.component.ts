
import { AfterViewInit,OnInit, Component, ViewChild,inject,ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule,AbstractControl } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
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
import { environment } from '../../../../environments/environment';
import { Validators } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { MobileVerificationComponent } from '../../../modules/auth/mobile-verification/mobile-verification.component'
import { WizardStepperComponent } from '../../../shared/components/wizard/wizard-stepper.component';



export const registerSchema: FormSchema = {
  steps: [
    // STEP 1
    {
      title: 'Applicant Details',
      fields: [

        {
          type: 'radio',
          name: 'applicantType',
          label: 'Applicant Type',
          required: true,

          options: [
            {
              label: 'Self/Owner',
              value: '1'
            },
            {
              label: 'Authorized Applicant',
              value: '2'
            }
          ]
        },

        {
          type: 'text',
          name: 'firstName',
          label: "Applicant's First Name",
          placeholder: "Applicant's First Name",
          required: true,
          min:2,
          max:25,
          validators: [
            CustomValidators.shortAlpha()
          ]
      
        },
        {
          type: 'text',
          name: 'middeleName',
          label: "Applicant's Middle Name",
          placeholder: "Applicant's Middle Name",    
          min:2,
          max:25,
           validators: [
            CustomValidators.shortAlpha()
          ]
              
        },

        {
          type: 'text',
          name: 'lastName',
          label: "Applicant's Last Name",
          placeholder: "Applicant's Last Name",
          required: true,
          min:2,
          max:25,
           validators: [
            CustomValidators.shortAlpha()
          ]
        },

        {
          type: 'text',
          name: 'designation',
          label: "Applicant's Designation",
          placeholder: "Applicant's Designation",
          required: true,
          min:2,
          max:25,
           validators: [
            CustomValidators.shortAlpha()
          ]
        },

        {
          type: 'email',
          name: 'email',
          label: 'Email',
          required: true,
          placeholder: 'Email',
          validationMessages: {
            required: 'Please enter your email address',
            email: 'Please enter a valid email address'
          },

          validators: [
            CustomValidators.email()
          ]
        }

      ]
    },

    // STEP 2
    {
      title: 'ID Proof Details',
      fields: [
        {
          type: 'select',
          name: 'idProof',
          label: 'ID Proof',
          placeholder: 'ID Proof',
          required: true,
          options: [
            {
              label: 'PAN',
              value: '1'
            },
            {
              label: 'Valid Driving License',
              value: '3'
            }
          ]
        },

        {
          type: 'text',
          name: 'idProofNumber',
          label: 'ID Proof Number',
          required: true,
          placeholder: 'ID Proof Number',
          min:10,
          max:15,
          maskOnBlur: true,
           validators: [
            Validators.required,
            CustomValidators.idProofValidator()                       
          ],
           
        },

        {
          type: 'file',
          name: 'resume',
          label: 'Upload Copy of ID Proof',
          required: true,
          validators: [
            CustomValidators.fileTypes([
              'pdf'
            ]),
            CustomValidators.fileMaxSizeKB(1024),
            CustomValidators.suspiciousFileUpload()

          ],

          validationMessages: {
            required: 'Please upload ID proof',
            // validationMessage:'Only PDF files are allowed',
            //   suspiciousFile: 'Suspicious or unsafe file detected.'
          }
          
        }

      ]
    },

 // STEP 3
 {
  title: 'Security',
  fields: [
    {
      type: 'password',
      name: 'password',
      min: 8,
      max: 50,
      label: 'Password',
      placeholder: 'Enter Password',
      required: true,
      icon: 'bi bi-lock',
      inputClass: 'pe-5 ps-5 pe-5',  
      validators: [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.password()
      ],

      validationMessages: {
        required: 'Please enter password',
        minlength:
          'Password must be at least 8 characters',
        passwordStrength:
          'Password must contain uppercase, lowercase, number and special character'
      }
    },

    {
      type: 'password',
      name: 'confirmPassword',
      min: 8,
      max: 50,
      label: 'Confirm Password',
      placeholder: 'Confirm Password',
      required: true,
      icon: 'bi bi-lock',
      inputClass: 'pe-5 ps-5 pe-5',  

      validators: [
        Validators.required,
        CustomValidators.matchPassword('password')
      ],

      validationMessages: {
        required: 'Please confirm password'
      }
    },
    

  ]
},
// STEP  4
{
  title: 'Declaration',

  fields: [  
      {
          type: 'checkbox',
          name: 'terms',
          label: '',
          text: `I hereby submit voluntarily at my own discretion, the physical copy / Number of ID Proofs such as PAN, 
          Valid Driving License to Punjab Water Regulation and Development Authority for the purpose of establishing my
           identity/address proof required for applying various online applications as per Punjab GroundWater Extraction and 
           Conservation Directions, 2023 and amendments thereof.`,
          required: true,
          className: 'checkbox-text-full',
          validators: [Validators.requiredTrue],
          validationMessages: {
            required: 'Please accept the declaration'
          }
        }

      ]
    }
  ]

};
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,  RouterModule, DynamicFormComponent, CommonModule,
             HeaderComponent,FooterComponent,NavbarComponent,AccessibilityBarComponent,
             TickerComponent,MobileVerificationComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  
})


export class RegisterComponent {

  APP_ASSETS = APP_ASSETS;
  private auth = inject(AuthService);
  // private router = inject(RouterModule);
  private toast = inject(ToastService);
 private _isOtpSent = false;

 

  get isOtpSent(): boolean {
    return this._isOtpSent;
  }

  set isOtpSent(value: boolean) {
    console.log('isOtpSent changed to:', value);
    this._isOtpSent = value;
  }

  @ViewChild(DynamicFormComponent)
  dynamicForm!: DynamicFormComponent;

  
  // Assign some variables
showRegistrationForm = false;
appliedNote = true;  
mobileNumber = '';
isOtpVerified = false;  
showMobileVerification = false;
showMobilePopup = false;
selectedButton: number | null = null;
showSelectionScreen = true;

  buttonSchema = [
    {
      label: 'Already Applied',
      type: 'button',
      className: 'btn px-4 py-2 fw-semibold rounded-pill btn-primary-govt',
      action: 'already_applied',
      icon: 'bi-file-earmark-check'
    },
    {
      label: 'Never Applied',
      type: 'button',
      className: 'btn px-4 py-2 fw-semibold rounded-pill btn-primary-govt',
      action: 'never_applied',
      icon: 'bi-file-earmark-plus'
    }
    
  ];

  note = `*Note:- If you already have an account,Please click here`;

registerSchema = registerSchema;
isAuthenticated$ = this.auth.isAuthenticated$();

  constructor(  
    private encryptService: EncryptionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


   ngOnInit() {
    this.checkVerificationState();
  }



checkVerificationState() {
  const verified = sessionStorage.getItem('mobileVerified') === 'true';
  const mobile = sessionStorage.getItem('verifiedMobile');

  if (verified && mobile) {
    this.mobileNumber = mobile;
    this.isOtpVerified = true;
    this.showSelectionScreen = false;
    this.showRegistrationForm = true;
    this.showMobileVerification = false;
  } else {
    this.showSelectionScreen = true;
    this.showRegistrationForm = false;
    this.showMobileVerification = false;
    this.isOtpVerified = false;
  }
}
  
   clearVerificationState() {
    sessionStorage.clear();
    // sessionStorage.removeItem('mobileVerified');
    // sessionStorage.removeItem('verifiedMobile');
    // sessionStorage.removeItem('verificationTimestamp');
    this.isOtpVerified = false;
    this.mobileNumber = '';
    this.showMobileVerification = false;
    this.showRegistrationForm = false;
    this.showMobilePopup = false;
    this.selectedButton = null;
  }

  // Optional: Reset the entire flow
  resetRegistration() {
    this.clearVerificationState();
    // Show the div again
    this.showMobileVerification = false;
    this.cdr.detectChanges();
  }


// Action on Buttons
   async handleAction(action: string, index: number) {
    this.selectedButton = index;

    switch (action) {
      case 'already_applied':       
        this.toast.error('Already registered? Log in to continue.',3000);
        // this.router.navigate(['/auth/login']);
        break;

      case 'never_applied':
          this.showMobileVerification  = true;       
        break;
    }
  }


onIdProofChange(value: string) {
const control =
  this.dynamicForm.form.get('idProofNumber');

  console.log("ID Proof=",value);
  if (!control) return;

  control.clearValidators();


  control.setValidators([
    Validators.required,
    Validators.maxLength(value === '1' ? 10 : 15),
    CustomValidators.idProofValidator()
  ]);

  switch (value) {  
    // For PAN card
    case '1':
      control.setValidators([
        Validators.required,       
        CustomValidators.pan(),      
        CustomValidators.alphaNum()
      ]);
      break;

    case '3': // for DL
      control.setValidators([
        Validators.required,       
        CustomValidators.drivingLicense(),
        CustomValidators.alphaNumDash()
      ]);
      break;
  }
  control.updateValueAndValidity();
}

onRegisterSubmit(formValue: any) {
  // console.log('FULL REGISTER DATA:', formValue);
  const payload = new FormData();  
  {   
     const encrpytPwd =  this.encryptService.encrypt(formValue.password)
     const encrpytPwdidProofNumber=  this.encryptService.encrypt(formValue.idProofNumber);

     const verificationToken = sessionStorage.getItem('verificationToken');
    // payload.append('mobile_number', this.mobileNumber);
    payload.append('verification_token', verificationToken ?? '');

    payload.append('applicant_type', formValue.applicantType);
    payload.append('applicant_first_name', formValue.firstName);
    payload.append('applicant_middle_name', formValue.middeleName);
    payload.append('applicant_last_name', formValue.lastName);
    payload.append('designation', formValue.designation);
    payload.append('email', formValue.email);
    payload.append('id_proof', formValue.idProof);
    payload.append('id_proof_number',encrpytPwdidProofNumber );
    payload.append('password',   encrpytPwd);
    payload.append('confirm_password', encrpytPwd);
    payload.append('terms', formValue.terms ? '1' : '0');
    payload.append('mobile_number', this.mobileNumber); 
 };

if (formValue.resume) {
payload.append('upload_copy_of_id_proof', formValue.resume);
}

  this.auth.register(payload).subscribe({
    next: (res) => {   
      if (res.success) {
        this.toast.success(res.message || 'Registration successful',3000);
        sessionStorage.clear();
        this.router.navigate(['/auth/login']);

      
      } else {
        this.toast.error(res.message || 'Registration failed',3000);
      }
    },
    error: (err) => {    
      if (err.status === 422) {
        const errors = err.error?.errors;

        if (errors) {
          Object.values(errors).forEach((msgs: any) => {
            this.toast.error(Array.isArray(msgs) ? msgs[0] : msgs);
          });
        } else {
          this.toast.error(err.error?.message || 'Validation failed');
        }
      } else {
        this.toast.error(err.error?.message || 'Registration failed');
      }
    }
  });
}



openMobilePopup() {
  this.showMobilePopup = true;
}

onVerified(data: any) {
  this.showMobilePopup = false;
  console.log(data);
}


// Add these properties and methods to your RegisterComponent class

onMobileVerified(event: { mobileNumber: string, otp: string }) {
  console.log('Mobile  Number verified:', this.mobileNumber );
  this.mobileNumber = event.mobileNumber;
  this.isOtpVerified = true;
  this.showMobileVerification = false;
  this.showRegistrationForm = true; 
  this.toast.success('Mobile number verified successfully!',3000);
   this.showMobilePopup = false;
  this.showSelectionScreen = false;

    // Save verification state to sessionStorage with timestamp
    sessionStorage.setItem('mobileVerified', 'true');
    sessionStorage.setItem('verifiedMobile', event.mobileNumber);
    sessionStorage.setItem('verificationTimestamp', Date.now().toString());
    // sessionStorage.setItem('verificationToken', event.token);
       
    // Force change detection
    this.cdr.detectChanges();

  // this.showRegistrationForm = true;
  // Proceed with registration
}

onMobileVerificationCancelled() {
  // console.log('Verification cancelled');
  this.showMobileVerification = false;
  this.cdr.detectChanges();
}

// Call this when you want to show verification
showVerification() {
  this.showMobileVerification = true;
}






}




