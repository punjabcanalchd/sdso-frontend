import { FormSchema } from '../../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../../common/validation/custom-validators';


export const applicantDetailsSchema: FormSchema = {
  isMultiFormWizard: true,

  fields: [
    
    {
      type: 'text',
      name: 'applicantName',
      label: 'Name of the Applicant',
      required: true,
      placeholder: 'Enter applicant name',
        min:2,
        max:25,
        validators: [
            CustomValidators.shortAlpha()
        ]
    },
    {
      type: 'text',
      name: 'designation',
      label: 'Designation',
      required: true,
      placeholder: 'Enter designation',
      validators: [CustomValidators.shortAlpha()]
      
    },
    {
      type: 'text',
      name: 'mobileNumber',
      label: 'Mobile Number',
      required: true,
      min: 10,
      max: 10,
      placeholder: 'Enter mobile number',
      validators: [CustomValidators.phone10()]
    },
    {
      type: 'email',
      name: 'emailId',
      label: 'Email Id',
      required: true,
      placeholder: 'Enter email address',
      validators: [CustomValidators.email()]
    },
    {
      type: 'file',
      name: 'panDocument',
      label: 'ID Proof of Applicant Attached (PAN)',
      required: true,
    //   accept: '.pdf,.jpg,.jpeg,.png' 
      validators: [CustomValidators.fileTypes(['pdf'])]
    },
     {
      type: 'html',
      name: 'editProfileNotice',
      label: '',
      html: `
          <div class="d-flex justify-content-end w-100 mb-2">
          <a href="/auth/user-profile" target="_blank" class="btn btn-primary-govt">
            <i class="bi bi-pencil-square me-2"></i> Edit Profile
          </a>
        </div>
      `
    },
  ]
};