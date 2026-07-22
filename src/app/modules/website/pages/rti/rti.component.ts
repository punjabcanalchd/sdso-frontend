import { Component, OnInit } from '@angular/core';
import {AccordionItemComponent} from '../../../../shared/components/accordion-item/accordion-item.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';
import { AccordionGroupComponent } from '../../../../shared/components/accordion-item/accordion-group.component';
import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';

export type RtiContentType = 'intro' | 'list' | 'pio-table' | 'stats-table';

export interface RtiSection {
  id: number;
  question: string;
  type: RtiContentType;
  content: any; 
  note?: string; // Optional footer note
}
@Component({
  selector: 'app-rti',
  imports: [AccordionItemComponent, AccordionGroupComponent,ContentPageComponent],
  templateUrl: './rti.component.html',
  styleUrl: './rti.component.scss',
})
export class RtiComponent implements OnInit{
   breadcrumb: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Right To Information' },
  ];
  
  // This will hold backend data
  sections: RtiSection[] = [];

  ngOnInit(): void {
    // Simulate fetching dynamic JSON data from backend Service
    this.sections = this.getMockBackendData();
  }


  // --- MOCK BACKEND RESPONSE ---
  private getMockBackendData(): RtiSection[] {
    return [
      {
        id: 1,
        question: 'Right to Information',
        type: 'intro',
        content: {
          boldPrefix: 'Section 4 (1) (a) of the RTI Act: ',
          text: ' Every public Authority shall maintain all its records duly catalogued and indexed in a manner and the form which facilitates the right to information under this Act and ensure that all records that are appropriate to be computerised are, within a reasonable time and subject to availability of resources, computerised and connected through a network all over the country on different systems so that access to such records is facilitated'
        }
      },
      {
        id: 2,
        question: 'RTI Act/ Rules',
        type: 'list',
        content: [
          'Right to Information Act 2005 (English)',
          'Right to Information Amendment Act 2019',
          'Punjab Right to Information Rules 2017'
        ]
      },
      {
        id: 3,
        question: 'Public Information Officers, Under RTI Act, 2005',
        type: 'pio-table',
        note: 'All division heads are designated as APIO.',
        content: [
          { name: 'Smt. Kamlesh Kumari Joshi', designation: 'Administrative Officer', email: 'ado[dot]pwrda[at]punjab[dot]gov[dot]in', phone: '0172-2727411', authority: 'Public Information Officer' },
          { name: 'Sh. Sanal Singla', designation: 'Secretary', email: 'secretary[dot]pwrda[at]punjab[dot]gov[dot]in', phone: '0172-2727411', authority: 'First Appellate Authority' }
        ]
      },
      {
        id: 4,
        question: 'RTI Manual (English)',
        type: 'list',
        content: [
            "RTI Manual (English)"
        ]
      },
      {
        id: 5,
        question: 'Details of Applications received under RTI and Information Provided',
        type: 'stats-table',
        content: [
          { year: '2021 to 2023', received: '17', provided: '17', pending: 'Nil' },
          { year: 'Jan, 2024 to July, 2024', received: '07', provided: '07', pending: 'Nil' },
          { year: 'Aug, 2024 to Sept, 2025', received: '17', provided: '17', pending: 'Nil' },
          { year: 'Oct, 2025 to Mar, 2026', received: '02', provided: '02', pending: 'Nil' },
        ]
      }
    ];
  }
}