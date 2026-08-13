import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';
import { BreadcrumbItem} from '../../../../shared/components/breadcrumb/breadcrumb'; 


export interface Division {
  title: string;
  duties: string[];
}

@Component({
  selector: 'app-division-wise-alloc',
  standalone: true,
  imports: [ContentPageComponent, CommonModule],
  templateUrl: './division-wise-alloc.component.html',
  styleUrl: './division-wise-alloc.component.scss',
})
export class DivisionWiseAllocComponent {
  
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Division-wise allocation of work' },
  ];


  divisions: Division[] = [
    {
      title: 'Research, Development & Decision Support Division',
      duties: [
        'Collect and analyse reports and statistics on Groundwater and Surface Water by various agencies; Assessment of future availability of Groundwater for Agriculture in different areas of the State;',
        'Collect and analyse information on Water related schemes, plans and projects of various Governments and Agencies;',
        'Collect and analyse new research and technologies for better water conservation and management;',
        'Collect and analyse water-related best practices across states and countries which can be relevant in Punjab;',
        'Build knowledge bank about hydro-geology and other characteristics of water aquifers in the State;',
        'Collect and analyse relevant information on Climate Change and its impact on water availability;',
        'New proposals and research projects for improving utilization of water and its conservation & management, with special emphasis on Agriculture;',
        'Issues related to the Integrated State Water Plan and the State Advisory Committee under the Act; and',
        'Office Orders, Instructions, Regulations etc. pertaining to the work of the Division',
        'Coordination with various Governments, Agencies and Institutions for the above purposes.'
      ]
    },
    {
      title: 'Permissions & Monitoring Division',
      duties: [
        'Matters related to grant of groundwater permissions to water users;',
        'Conduct of surveys and inspections to monitor compliance with the terms and conditions of permissions granted by the Authority;',
        'Action in cases of breach of terms and conditions of Permissions granted;',
        'Initiate all Inquiries by the Authority and its officers under the Punjab Water Resources (Management and Regulation) Act, 2020.',
        'Office Orders, Instructions, Regulations etc pertaining to the work of the Division',
        'Action in cases of groundwater extraction without permission.'
      ]
    },
    {
      title: 'Information Technology Systems and Communication Division',
      duties: [
        'Design, development, operation, maintenance, integration and upgradation of relevant software projects and software systems required by the Authority;',
        'Designing and maintaining Email, Social Media, Websites and Portals of the Authority and ensuring their security;',
        'Enabling and ensuring fully digital office working including digital interface with all clients;',
        'Training and technical assistance for information systems;',
        'Coordination with NIC and DGR Punjab; and',
        'Office Orders, Instructions, Regulations etc. pertaining to the work of the Division.',
        'Maintenance of Computer and Communication Hardware.',
        'Monitoring, collating, and keeping record of news, articles, videos, posts about SDSO or water issues in all media including print, social media, & electronic media;',
        'Ensuring strategic communication of matters with all stakeholders related to the work of the Authority, preparing and delivering relevant content for communication with all types of Media, including digital platforms such as Facebook, Twitter, YouTube, etc.;',
        'Content management of websites, portals, social media accounts of the Authority, and',
        'Public Information, Generating Awareness and Behaviour Change related to water, in accordance with the objectives of the Authority.'
      ]
    },
    {
      title: 'Meetings, Public Hearings and Complaints Division:',
      duties: [
        'All work relating to Meetings of the Authority, including issue of Agenda, recording of draft Minutes, issue of approved Minutes, keeping proper record of the Agenda & Minutes and follow up of action required on the Minutes etc;',
        'Assisting the Authority in conduct of all Hearings and proceedings, including preparing, receiving and processing petitions, applications, representations etc. along with required fees, issuing notices and summons, issuing certified copies of orders, maintaining record of all cases and supplying copies thereof; and,',
        'Agenda, minutes and correspondence of Advisory Committee',
        'Follow up all work relating to Inquires by the Authority and its officers under the Punjab Water Resources (Management and Regulation) Act, 2020.',
        'Office Orders, Instructions, Regulations etc. pertaining to the work of the Division.',
        'Coordination with Government Departments and Agencies.',
        'Public complaints relating groundwater and their follow up.'
      ]
    },
    {
      title: 'Finance and Accounts Division',
      duties: [
        'All matters relating to the budget, finances and accounts of the Authority;',
        'All matters concerning the Fund of the Authority, including book-keeping and reconciliation etc.;',
        'Audit of Fund of the Authority;',
        'Bank Accounts of the Authority;',
        'Balance sheet, income and expenditure statements, GST, income tax and other taxes;',
        'Supervision of procurement, pre-audit, concurrent audit etc.;',
        'Compliance with rules and principles of financial prudence;',
        'Monitoring of receivables from water users etc.; and',
        'Office Orders, Instructions, Regulations, etc. pertaining to the work of the Division',
        'Assistance to the Authority in financial analysis for Tariff Fixation etc.',
      ]
    },
    {
      title: 'Legal Divison',
      duties: [
        'All work relating to the legal vetting of Regulations, Guidelines, Directions, Tariff Orders etc. of the Authority, including processing of comments and objections received by the Authority.',
        'Cases in all Courts and Forums related to the Authority;',
        'Collating important decisions of Courts and Tribunals on Water issues and important instructions issued by the Government of Punjab, CGWA, Ministry of Jal Shakti, GoI',
        'Legal inputs relating to inquiries by the Authority and its officers under the Punjab Water Resources (Management and Regulation) Act, 2020;',
        'Cases of violation of Directions of the Authority, and Communication with the GoI and Government of Punjab in connection with above-mentioned matters.'
      ]
    },
    {
      title: 'General Administration',
      duties: [
        'Communication and Coordination with Governments and Public Agencies with all issues related to employees, establishment etc;',
        'Procurement of material, supplies and equipment required by the Authority',
        'Upkeep and maintenance of office building and infrastructure;',
        'Matters relating to Right to Information, and Miscellaneous matters, Residual matters.',
        'Office Orders, Instructions, Regulations etc. pertaining to the work of the Division.'
      ]
    },
    {
      title: 'Human Resources Division',
      duties: [
        'Employee-related issues including recruitment, appointments, design and implementation of contracts, monitoring of outsourced work, performance management, performance appraisal, service record',
        'Employee remuneration including pay, wages, allowances, statutory contributions, deductions, increments',
        'Employee attendance, leave, termination;',
        'Employee related disciplinary matters, dispute resolution and court cases',
        'Office coordination, documentation and record keeping;',
        'Human resource development and training',
        'Supervision of outsourced work including contracts and disputes with Outsourcing Agencies;',
        'Office Orders, Instructions, Regulations etc pertaining to the work of the Division.',
        'Distribution of work and delegation of Powers;'
      ]
    },
    {
      title: 'Tariff and Regulations',
      duties: [
        'All work related to Tariff (under Section 17 and 18 of the Punjab Water Resources (Management and Regulation) Act, 2020); and',
        'Regulations under Section 36 of the Act, 2020.'
      ]
    }
  ];
}