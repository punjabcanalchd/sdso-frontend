import { Component, EventEmitter, Output, OnDestroy, Input, ViewChild, ChangeDetectorRef, AfterViewInit,NgZone  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { CustomValidators } from '../../../common/validation/custom-validators';
import { Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mobile-verification',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    DynamicFormComponent
  ],
  templateUrl: './mobile-verification.component.html',
  styleUrls: ['./mobile-verification.component.scss']
})
export class MobileVerificationComponent implements OnDestroy, AfterViewInit {
  @Output() verified = new EventEmitter<{ mobileNumber: string, otp: string }>();
  @Output() cancelled = new EventEmitter<void>();
  @Input() title: string = 'Mobile Number Verification';
  @Input() countryCode: string = '+91';
  
  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;
  
  step = 1;
  mobileNumber = '';
  otpCode = '';
  isLoading = false;
  isVerifying = false;
  resendDisabled = false;
  resendTimer = 0;
  // private timerInterval: any;
  isOtpSent = false;
  otpExpiryTime = environment.otpExpiryTime;
  otpTimer: any;
  isOtpExpired = false;
showResendButton =false;

   private readonly TEST_OTP = '123456';
  generatedOtp = this.TEST_OTP;
  // Force change detection for SweetAlert
  triggerUpdate = 0;

  // MOBILE VERIFICATION SCHEMA
  mobileVerificationSchema: any = {
    // title: 'Mobile Verification',
    layoutStyle: 'popup',
    fields: [
      {
        type: 'text',
        name: 'mobileNumber',
        label: 'Mobile Number',
        class: "no-spinner mobile-input",
        placeholder: 'Enter Mobile Number',
        required: true,
        max: 10,       
        min: 10,
        validationMessages: {
          required: 'Please enter your contact number',
          phone: 'Please enter a valid contact number'
        },
        validators: [
          CustomValidators.phone10(),        
        ],
         // Custom wrapper class for styling
        wrapperClass: 'mobile-field-wrapper',
        labelClass: 'form-label fw-semibold',
        inputClass: 'form-control-plaintext'
      
      }
    ],
    showCustomButtons: true,
    buttons: [
      {
        type: 'button',
        label: 'Send OTP',
        class: 'btn btn-primary-govt',
        action: 'sendOtp',
        ignoreFormValidation: true,
        icon: 'bi bi-arrow-right-circle',
        // formClass: 'dynamic-form-custom',
        buttonContainerClass: 'button-container-custom'
      }
    ]
  };

  // OTP SCHEMA
  otpSchema: any = {
    // title: 'OTP Verification',
    layoutStyle: 'popup',
    
    fields: [
      {
        type: 'text',
        name: 'otp',
        label: 'Enter OTP',
        placeholder: 'Enter 6-digit OTP',
        required: true,
        max: 6,
        min: 6,
        class: 'otp-input',

        validationMessages: {
          required: 'Please enter OTP',
          minlength: 'OTP must be 6 digits',
          maxlength: 'OTP must be 6 digits'
        },
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6)
        ],
        wrapperClass: 'otp-field-wrapper',
        labelClass: 'form-label fw-semibold',
        inputClass: 'form-control-plaintext text-center',
      }   
    ],
     showCustomButtons: true,

    buttons: [
    {
      type: 'button',
      label: 'Resend OTP',
      class: 'btn  flex-fill',
      action: 'resendOtp',
      visible: true,
      disabled: true,
      icon: 'bi bi-arrow-clockwise',
      ignoreFormValidation:true,
    },
    {
      type: 'button',
      label: 'Verify OTP',
      class: 'btn  flex-fill',
      action: 'verifyOtp',
      visible: true,
      icon: 'bi bi-check-circle'
    }]

    };

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngAfterViewInit() {
    
      this.ngZone.run(() => {
      this.cdr.detectChanges();
    });
  }

  // Handle dynamic form button clicks
onDynamicButtonClick(event: any) {
  if (event.action === 'sendOtp') {
    this.sendOtp(event.formValue);
  } else if (event.action === 'verifyOtp') {
    this.verifyOtp(event.formValue);
  } else if (event.action === 'resendOtp') {
    this.resendOtp();
  }
}

  // Send OTP
sendOtp(formValue: any) {
  const mobile = formValue.mobileNumber;

  this.mobileNumber = mobile;
  this.isLoading = true;

  this.auth.sendOtp(mobile).subscribe({
    // next: (res: any) => {
    //   // console.log('OTP sent response:', res);
    //   if (
    //     res?.success === true ||
    //     res?.status === 200 
    //   ) {
    //     // this.generatedOtp = res.data?.otp;
    //     this.generatedOtp = this.TEST_OTP;


    //     this.isOtpSent = true;
    //     this.step = 2;

    //     this.resetOtpTimer();
    //     this.startOtpTimer();

    //     // this.toast.success(`OTP sent successfully to ${this.mobileNumber}`);
    //    const smsSuccess = res?.data?.sms_status?.success;
    //   const sandesSuccess = res?.data?.sandes_status?.success;

    //   if (smsSuccess && sandesSuccess) {
    //     this.toast.success(`OTP sent successfully to ${this.mobileNumber}`);
    //   } else if (smsSuccess && !sandesSuccess) {
    //     this.toast.warning('OTP sent via SMS only. Sandes delivery failed.');
    //   } else if (!smsSuccess && sandesSuccess) {
    //     this.toast.warning('OTP sent via Sandes only. SMS delivery failed.');
    //   } else {
    //     this.toast.error('Failed to send OTP through both SMS and Sandes.');
    //   }

    //   } else {
    //     this.toast.error(res?.message || 'Failed to send OTP');
    //   }

    //   this.isLoading = false;
    //   this.cdr.detectChanges();
    // },

    next: (res: any) => {
    this.isLoading = false;

    if (!(res?.success || res?.status === 200)) {
      this.toast.error(res?.message || 'Failed to send OTP');
      this.cdr.detectChanges();
      return;
    }

  // const smsSuccess = res?.data?.sms_status?.success;
  // const sandesSuccess = res?.data?.sandes_status?.success;

  // // Proceed only if at least one channel succeeded
  // if (smsSuccess || sandesSuccess) {
  //   this.generatedOtp = this.TEST_OTP;
  //   this.isOtpSent = true;
  //   this.step = 2;

  //   this.resetOtpTimer();
  //   this.startOtpTimer();
  // }

  // if (smsSuccess && sandesSuccess) {
  //   this.toast.success(`OTP sent successfully to ${this.mobileNumber}`);
  // } else if (smsSuccess) {
  //   this.toast.warning('OTP sent successfully via SMS. Sandes delivery failed.');
  // } else if (sandesSuccess) {
  //   this.toast.warning('OTP sent successfully via Sandes. SMS delivery failed.');
  // } else {
  //   this.toast.error('Failed to send OTP through both SMS and Sandes.');
  // }


  const smsSuccess = res?.data?.sms_status?.success;
  const sandesSuccess = res?.data?.sandes_status?.success;

  const sandesErrorMessage =
    res?.data?.sandes_status?.response?.message;

  const smsErrorMessage =
    res?.data?.sms_status?.response?.message;


if (smsSuccess || sandesSuccess) {

    this.generatedOtp = this.TEST_OTP;
    this.isOtpSent = true;
    this.step = 2;

    this.resetOtpTimer();
    this.startOtpTimer();

    if (smsSuccess && sandesSuccess) {
        this.toast.success(
            `OTP sent successfully to ${this.mobileNumber}`
        );
    } else if (smsSuccess) {
        this.toast.warning(
            'OTP sent via SMS only. Sandes delivery failed.'
        );
    } else {
        this.toast.warning(
            'OTP sent via Sandes only. SMS delivery failed.'
        );
    }

} else {
        this.toast.error(
        sandesErrorMessage ||
        smsErrorMessage ||
        'Failed to send OTP through both SMS and Sandes.'
    );
}
    this.cdr.detectChanges();
  },
    error: (err: any) => {
      console.error('OTP Error:', err);

      this.isLoading = false;

      if (err?.error?.data?.otp) {
        // this.generatedOtp = err.error.data.otp;
        this.generatedOtp = this.TEST_OTP;

        this.isOtpSent = true;
        this.step = 2;

        this.resetOtpTimer();
        this.startOtpTimer();

        this.toast.warning(
          'SMS service failed, but OTP has been generated.'
        );
      } else {
        let errorMessage = 'Failed to send OTP.';

        if (err.status === 0) {
          errorMessage =
            'Cannot connect to server. Please check if backend is running.';
        } else if (err.status === 404) {
          errorMessage = 'API endpoint not found.';
        } else if (err.status === 422) {
          errorMessage =
            err.error?.message || 'Phone number is already registered.';
        } else if (err.status === 429) {
          errorMessage = 'Please try again after 30 seconds.';
        } else {
          errorMessage =
            err.error?.message || 'Failed to send OTP.';
        }

        this.toast.error(errorMessage);
      }

      this.cdr.detectChanges();
    }
  });
}

  // Verify OTP
  verifyOtp(formValue: any) {
   
    // let mobileNumber = formValue.mobileNumber;
    // console.log("Mobile NUmber==", mobileNumber)
    const otp = formValue.otp;

    if (!otp || otp.length !== 6) {
      this.toast.error('Please enter a valid 6-digit OTP',3000);
      return;
    }

    this.isVerifying = true;    
    const payload = {
        mobileNumber: this.mobileNumber,
        sandes_phone_number: this.mobileNumber,
        sandes_verification_otp: otp,
        unit_id: '00000000000'       
      };
   
    this.auth.verifyOtp(payload).subscribe({
      next: (res: any) => {       
        this.isVerifying = false;
        
        if (res && res.status === 'success' ) {
          this.resetOtpTimer();           
          localStorage.setItem('verificationToken', res.token);        
          this.verified.emit({
          mobileNumber: this.mobileNumber,
          otp: otp
        });

        this.toast.success('OTP Verified Successfully!');
        } else {
          this.toast.error(res?.data?.message || 'Invalid OTP. Please try again.');
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Verification Error:', err);
        this.isVerifying = false;
        this.toast.error('OTP verification failed. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  // Resend OTP
  resendOtp() {
    if (!this.mobileNumber) {
      this.toast.error('Mobile number not found.',3000);
      return;
    }

    if (!this.isOtpExpired && this.otpTimer) {
      this.toast.warning(`Please wait ${this.otpExpiryTime} seconds before requesting a new OTP`,3000);
      return;
    }

    this.toast.info('Resending OTP...',3000);

    this.auth.sendOtp(this.mobileNumber).subscribe({
      next: (res: any) => {
        // console.log('Resend OTP Response:', res);

        if (res && (res.success === true || res.status === 200)) {
          this.isOtpExpired = false;
          this.showResendButton = false;
          
          this.resetOtpTimer();
          this.startOtpTimer();
          this.updateOtpButtonVisibility(true, false);
          
          const otpControl = this.dynamicForm?.form?.get('otp');
          if (otpControl) {
            otpControl.setValue('');
          }
          
          this.toast.success('OTP resent successfully');
        } else {
          this.toast.error(res?.message || 'Failed to resend OTP');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        // console.error('Resend OTP Error:', err);
        if (err.status === 429) {
          this.toast.error('Too many requests. Please wait 30 seconds before trying again.');
        } else {
          this.toast.error(err.error?.message || 'Failed to resend OTP. Please try again.');
        }
        this.cdr.detectChanges();
      }
    });
  }



startOtpTimer() {

this.resetOtpTimer();
this.otpExpiryTime = environment.otpExpiryTime;
this.otpTimer = setInterval(() => {
this.otpExpiryTime--;

    const resendBtn = this.otpSchema.buttons.find(
      (b: any) => b.action === 'resendOtp'
    );

     if (resendBtn) {
      resendBtn.visible = true;
    resendBtn.disabled = true;
  }

    if (resendBtn) {
      resendBtn.label =
        this.otpExpiryTime > 0
          ? `Resend OTP (${this.otpExpiryTime}s)`
          : 'Resend OTP';

      resendBtn.disabled = this.otpExpiryTime > 0;
    }

    if (this.otpExpiryTime <= 0) {
      this.onOtpExpired();
    }

  
    this.cdr.detectChanges();
  }, 1000);
}


onOtpExpired() {
  clearInterval(this.otpTimer);

  const resendBtn = this.otpSchema.buttons.find(
    (b: any) => b.action === 'resendOtp'
  );

  this.isOtpExpired = true;
  this.generatedOtp = this.TEST_OTP;

  if (resendBtn) {
    resendBtn.disabled = false;
    resendBtn.label = 'Resend OTP';
  }

  this.cdr.detectChanges();
}


  updateOtpButtonVisibility(showVerify: boolean, showResend: boolean) {
  const verifyBtn = this.otpSchema.buttons.find(
    (b: any) => b.action === 'verifyOtp'
  );

  const resendBtn = this.otpSchema.buttons.find(
    (b: any) => b.action === 'resendOtp'
  );

  if (verifyBtn) {
    verifyBtn.visible = true;
  }

  if (resendBtn) {
    resendBtn.visible = true;
  }

  this.cdr.detectChanges();
}

  resetOtpTimer() {
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
      this.otpTimer = null;
    }
  }

  cancel() {
    this.cancelled.emit();
  
  }



  ngOnDestroy() {
    this.resetOtpTimer();
  }
}