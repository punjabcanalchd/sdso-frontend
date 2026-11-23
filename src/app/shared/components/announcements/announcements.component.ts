import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { LanguageService } from '../../../core/services/language.service';
import { NoticeBoardComponent } from '../../../modules/website/components/notice-board/notice-board-component';

export interface ImportantLink {
  template_id: number;
  name: string;
  status: boolean;
  display_on_home_page: boolean;
  public_id: string;
  url: string | null;

  language_description?: {
    template_id: number;
    language_id: number;
    message: string;
  } | null;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, NoticeBoardComponent],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss',
})
export class Announcements implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private languageService = inject(LanguageService);

  importantLinks: ImportantLink[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.getHomeData();
  }
  getHomeData(): void {

  this.isLoading = true;

  const language = this.languageService.getCurrentLang() || 'en';

  this.api.get<any>(`/front/home/${language}`).subscribe({

    next: (res) => {

      this.isLoading = false;

      console.log('HOME API RESPONSE:', res);

      if (res?.success && Array.isArray(res?.data?.importantLinks)) {

        this.importantLinks = res.data.importantLinks.map((item: any) => {

          const translation =
            item.language_description || item.languageDescription;

          return {
            template_id: item.template_id,
            name: translation?.message || item.name || 'Employee Corner',
            status: item.status,
            display_on_home_page: item.display_on_home_page,
            public_id: item.public_id,
            access_type: item.access_type,
            language_description: translation,

            // Download URL
            url: item.template_id
              ? `/attachments/noticeboard/${item.public_id}`
              : null
          };

        }).filter((item: any) => item.access_type == 1);

      } else {

        this.importantLinks = [];

      }

      console.log('IMPORTANT LINKS FINAL:', this.importantLinks);

      this.cdr.markForCheck();

    },

    error: (err) => {

      this.isLoading = false;

      console.error('Failed to load Important Links:', err);

      this.cdr.markForCheck();

    }

  });
}
// getHomeData(): void {

//   this.isLoading = true;

//   const language = this.languageService.getCurrentLang() || 'en';

//   this.api.get<any>(`/front/home/${language}`).subscribe({

//     next: (res) => {

//       this.isLoading = false;

//       console.log('HOME API RESPONSE:', res);

//       if (res?.success && Array.isArray(res?.data?.importantLinks)) {

//         this.importantLinks = res.data.importantLinks.map((item: any) => {

//           const translation =
//             item.language_description || item.languageDescription;

//           return {
//             template_id: item.template_id,

//             name: translation?.message || item.name,

//             status: item.status,

//             display_on_home_page: item.display_on_home_page,

//             public_id: item.public_id,

//             language_description: translation

//           };

//         });

//       } else {

//         this.importantLinks = [];

//       }

//       // console.log('IMPORTANT LINKS FINAL:', this.importantLinks);

//       this.cdr.markForCheck();

//     },

//     error: (err) => {

//       this.isLoading = false;

//       console.error('Failed to load Important Links:', err);

//       this.cdr.markForCheck();

//     }

//   });
// }
}