
import { Component, OnInit } from '@angular/core';
import {AccordionItemComponent} from '../../../../shared/components/accordion-item/accordion-item.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';
import { AccordionGroupComponent } from '../../../../shared/components/accordion-item/accordion-group.component';
import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';
import { CommonModule } from '@angular/common';
export interface DirectoryEntry {
  name: string;
  designation: string;
  email: string;
}

export interface DirectorySection {
  id: number;
  question: string;
  content: any;
  note?: string; 
}
@Component({
  selector: 'app-office-directory',
  imports: [AccordionItemComponent, AccordionGroupComponent,ContentPageComponent,CommonModule],
  templateUrl: './office-directory.component.html',
  styleUrl: './office-directory.component.scss',
})
export class OfficeDirectoryComponent implements OnInit{
   pageTitle = 'Office Directory';
  breadcrumb: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Office Directory' },
  ];
  
  
  
sections: DirectorySection[] = [];

  ngOnInit(): void {
    // Assign the data when the component loads
    this.sections = this.getMockBackendData();
  }

  private getMockBackendData(): DirectorySection[] {
    return [
      {
        id: 1,
        question: 'Administration',
        content: [
          { name: 'Sh. Vijoy Kumar Singh, IAS (Retd.)', designation: 'Chairperson', email: 'chairperson[dot]SDSO[at]punjab[dot]gov[dot]in'},
          { name: 'Sh. Sher Singh', designation: 'Member', email: 'member[dot]SDSO1[at]punjab[dot]gov[dot]in' },
          { name: 'Post Vacant', designation: 'Member', email: '' },
         
        ]
      },
      {
        id: 2,
        question: 'Managerial & Professional',
        content: [
           { name: 'Post Vacant', designation: 'Secretary', email: '	secretary[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Sh. Rajesh Vashisht', designation: 'Technical Advisor', email: 'ta[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Sh. Sanal Singla', designation: 'Executive Engineer', email: 'ee2[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Sh. Navdeep Singh', designation: 'Executive Engineer', email: 'ee[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Sh. Davinder Singh', designation: 'Manager (Accounts)', email: 'ma[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Sh. Kamalpreet Singh', designation: 'Manager IT', email: 'smit[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Sh. Nitin Goyal', designation: 'Manager Legal', email: 'smlegal[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Sh. Mandeep Singh', designation: 'Sub-Divisional Engineer', email: 'mandeep[dot]singh80[at]punjab[dot]gov[dot]in' },
           { name: 'Post Vacant', designation: 'Sub-Divisional Engineer', email: '' },
           { name: 'Sh. Prince Dhiman', designation: 'Technical Manager (Groundwater)', email: 'tmgw[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Sh. Anil Kumar', designation: 'Technical Manager (Agriculture)', email: 'tma[dot]SDSO[at]punjab[dot]gov[dot]in' },
           { name: 'Smt. Ravneet Lumba', designation: 'Legal Executive', email: 'ravneet[dot]lumba[at]punjab[dot]gov[dot]in' },
        ]
      },
      {
        id: 3,
        question: 'Private Secrataries',
        content: [
          { name: 'Smt. Kamlesh Kumari Joshi', designation: 'Private Secretary', email: 'kamlesh[dot]joshi1[at]punjab[dot]gov[dot]in' },
        ]
      }
      // You can easily add more directory sections (like IT, Finance, etc.) here later!
    ];
  }
}