import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

// 1. Define the structure to handle both standard duties and nested bullet points
export interface DutyItem {
  text: string;
  subDuties?: string[];
}

export interface StaffRole {
  roleTitle: string;
  duties: DutyItem[];
}

@Component({
  selector: 'app-staff-duties',
  standalone: true,
  imports: [ContentPageComponent, CommonModule],
  templateUrl: './staff-duties.component.html',
  styleUrl: './staff-duties.component.scss' // You can delete the actual .scss file!
})
export class StaffDutiesComponent {
  pageTitle = 'Duties & Responsibilities of Staff';
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Duties & Responsibilities of Staff' },
  ];

  // 2. The Transcribed Data Array
  staffRoles: StaffRole[] = [
    {
      roleTitle: 'Secretary',
      duties: [
        { text: 'The Secretary shall report to the Chairperson and shall exercise such functions as are assigned to him by the Regulations or otherwise by the Chairperson.' },
        { 
          text: 'In particular and without prejudice to the generality of the provisions of clause (1) above, the Secretary\'s functions shall include:',
          subDuties: [
            'To receive or cause to be received all petitions, applications, and other filings made to the Authority;',
            'To assist the Authority in proceedings conducted by the Authority;',
            'To authenticate or cause to be authenticated the orders passed by the Authority;',
            'To ensure compliance of the orders passed by the Authority; and',
            'To collect from the State Governments, the Central Government and their agencies, water users, entities, or any other person, such information, records, documents, reports as may be considered useful for the purpose of efficient discharge of the functions of the Authority under the Act.',
            'To correspond with and co-ordinate with the State Governments, Central Government & their agencies.'
          ]
        },
        { text: 'The Authority may delegate to the Secretary such of the functions of the Authority and on such terms and conditions, as the Authority may direct for the purpose.' },
        { text: 'The Secretary or any other officer designated by him in this regard shall have the custody of the Seal and records of the Authority.' },
        { text: 'The Secretary may, with the approval of the Chairperson, delegate to any other Officer of the Authority any function required by these Regulations or otherwise to be performed by the Secretary.' },
        { text: 'In the absence of the Secretary, such other officer of the Authority, as may be nominated by the Chairperson, may exercise the functions of the Secretary.' },
        { text: 'The terms and conditions of the services of the Secretary, officers and staff of the Authority shall be subject to such Regulations as may be specified by the Authority in terms of section 8 of the Act.' },
        { text: 'The Officers and Staff of the Authority shall report to the Secretary who shall function as the Head of the Office.' }
      ]
    },
    {
      roleTitle: 'Manager (Legal)',
      duties: [
        { text: 'Responsible for giving legal advice to the Authority on the matters referred to him.' },
        { text: 'To assist the Authority in drafting rules, regulations, directions and other legal documents.' },
        { text: 'To follow up of all court cases for & against the Authority, including vetting of plaints, replies etc.' },
        { text: 'To prepare replies to legal notices.' },
        { text: 'To assist the Authority in its proceedings and conduct of hearings.' },
        { text: 'Perform such other duties as may be assigned to him from time to time.' }
      ]
    },
    {
      roleTitle: 'Manager (IT)',
      duties: [
        { text: 'Collaborate with a team of developers and designers.' },
        { text: 'Communicate with the Stakeholders to meet their requirements.' },
        { text: 'Coordinate internal resources and third parties/vendors for the efficient execution of multiple projects.' },
        { text: 'Ensure that all projects are delivered on-time, with in scope and within budget.' },
        { text: 'Convey effectively with all task progress, evaluations, suggestions, schedules along with technical and process issues develop a detailed project plan to monitor and track progress.' },
        { text: 'Solving complex digital performance problems and architectural challenges' },
        { text: 'Ensure Integration of user facing elements developed by front-end developers.' },
        { text: 'Assigning tasks to the team members and take output from them as per requirement.' },
        { text: 'Ensure project compliance and alignment with relevant standards, guidelines and recommended practices..' },
        
      ]
    },
    {
      roleTitle: 'Manager (Accounts)',
      duties: [
        { text: 'In charge of drawl & disbursement of salaries, bills Finance and Accounts and other expenditure, preparation of accounts and submission of schedules etc.' },
        { text: 'Maintaining and managing the Fund of the Authority as per the provisions of the Act, Rules, and Regulations etc.' },
        { text: 'Accounts, compliance with financial rules, procurement rules etc.' },
        { text: 'Monitoring:',
          subDuties: [
            'Book keeping in electronic format,',
            'Accounting and financial software services.'
          ]
         },

        { text: 'Billing and outstanding, recoveries of over-dues and arrears.' },
        { text: 'Budgeting, monthly and quarterly accounts (receipts and expenditure) statements.' },
        { text: 'Audit, including post audit and pre-audit.' },
        { text: 'Procurement, tenders, quotations, invoices, taxes, statutory deductions and contributions, payroll, salaries, wages.' },
        { text: 'To liaise with Banking, deposits, investments, cash management.' },
        { text: 'Any other duties and work related to accounts, finance, budget and audit etc' },
         { text: '' },
      ]
    }
  ];
}