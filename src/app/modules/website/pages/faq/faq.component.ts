import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionGroupComponent } from '../../../../shared/components/accordion-item/accordion-group.component';
import { AccordionItemComponent } from '../../../../shared/components/accordion-item/accordion-item.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

export interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, AccordionGroupComponent, AccordionItemComponent, BreadcrumbComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  breadcrumb: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Frequently Asked Questions' },
  ];
  // ── Add / remove / edit questions here ──────────────────
  faqs: FaqItem[] = [
    {
      number: 'Q.1',
      question: 'From which date do the Punjab Groundwater Directions come into force?',
      answer: 'The Directions come into force from 1st February 2023.',
    },
    {
      number: 'Q.2',
      question: 'From which date does a User have to pay the Groundwater Charges?',
      answer: 'A User has to pay the Groundwater Charges from 1st April 2023 as notified by the Authority.',
    },
    {
      number: 'Q.3',
      question: 'Which Users are not required to apply for permission?',
      answer: 'Users extracting groundwater for domestic purposes with a hand pump or manual extraction not exceeding the prescribed limit are not required to apply for permission.',
    },
    {
      number: 'Q.4',
      question: 'How should a User apply for permission?',
      answer: 'A User should apply for permission through the PWRDA online portal by filling in the prescribed application form and submitting the required documents.',
    },
    {
      number: 'Q.5',
      question: 'What documents does a User have to attach with the application for permission?',
      answer: 'The User must attach proof of identity, proof of land ownership or lease, site plan, details of the extraction unit, and any other documents as specified in the application form.',
    },
    {
      number: 'Q.6',
      question: 'By which date does an existing User have to apply for permission?',
      answer: 'Existing Users were required to apply for permission by 31st March 2023 as per the Punjab Groundwater Directions.',
    },
    {
      number: 'Q.7',
      question: 'What happens if an existing User does not apply for permission within the stipulated time period?',
      answer: 'If an existing User does not apply within the stipulated time period, they may be liable to penalties as prescribed under the Punjab Water Resources (Management & Regulation) Act, 2020.',
    },
    {
      number: 'Q.8',
      question: 'By which date does a new Unit have to apply for permission?',
      answer: 'A new Unit must apply for permission before commencing extraction of groundwater.',
    },
    {
      number: 'Q.9',
      question: 'What if a new Unit commences extraction of groundwater before 1st April 2023?',
      answer: 'A new Unit that commenced extraction before 1st April 2023 was required to apply for permission by 31st March 2023 and is treated as an existing User for the purpose of these Directions.',
    },
    {
      number: 'Q.10',
      question: 'In how much time should the User expect to obtain the permission of the Authority, after submitting a complete Application?',
      answer: 'The Authority shall endeavour to grant or refuse permission within 60 days of receipt of a complete application.',
    },
    {
      number: 'Q.11',
      question: 'For how long will the permission so obtained be valid?',
      answer: 'The permission granted by the Authority shall be valid for a period of five years from the date of issue, subject to renewal.',
    },
    {
      number: 'Q.12',
      question: 'If a User has already obtained a No Objection Certificate (NOC) from the Central Groundwater Authority, does it need to apply to PWRDA?',
      answer: 'Yes. A NOC from the Central Groundwater Authority does not substitute the permission required under the Punjab Water Resources (Management & Regulation) Act, 2020. The User must separately apply to PWRDA.',
    },
  ];

}
