import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSchema } from '../../../../core/models/form-schema.model';
import { MultiFormWizardComponent } from '../../../../shared/components/form-elements/multi-form-wizard/multi-form-wizard.component';
import { instructionSchema } from './steps/instruction/instruction.schema';
import { applicantDetailsSchema } from './steps/applicant-details/applicantDetail.schema';
import { unitUserDetailsSchema } from './steps/unit-user-details/unitUserDetails.schema';
import { gwReqDetailSchema } from './steps/gw-req-detail/gwReqDetail.schema';
import { gwProposedTubewellSchema } from './steps/gw-proposed-tubewell/gwPrposedTubewell.schema';
import { gwExistingTubewellDetailSchema } from './steps/gw-existing-tubewell-detail/gwExistingTubewellDetail.schema';
import { layoutPlansSchema } from './steps/layout-plans/layoutPlans.schema';

@Component({
  selector: 'app-application-stepper',
  standalone: true,
  imports: [CommonModule, MultiFormWizardComponent],
  templateUrl: './application-stepper.component.html',
  styleUrls: ['./application-stepper.component.scss']
})
export class ApplicationStepperComponent {
  @Output() stepClick = new EventEmitter<number>();


  forms: FormSchema[] = [
  instructionSchema,
  unitUserDetailsSchema,
  applicantDetailsSchema,
  gwReqDetailSchema,
  gwExistingTubewellDetailSchema,
  gwProposedTubewellSchema,
  layoutPlansSchema,
  // feesAndChargesSchema
];
  // Steps titles (must match the number of forms)
  steps: string[] = [
    'Form Instruction',    
    'Unit & User Details',
    'Applicant Details',
    'GW Req Detail',
    'GW Existing Tubewell Detail',
    'GW Proposed Tubewell',
    'Layout Plans',
    'Fees and Charges'
  ];

  // Initial data (can be used to pre-fill forms)
  initialData: any = {};

  // Method to handle step changes if needed
  onStepChange(index: number): void {
    this.stepClick.emit(index);
  }
}