import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

// import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import {
  DocumentListComponent,
  TableColumn
} from '../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';

import { ToastService } from '../../../shared/services/toast.service';
// import { TabsComponent } from '../../../shared/components/tabs/tabs.component';

import { AuthService } from '../../../core/auth/auth.service';
import { pageSchema } from './page-form.schema';
import { LanguageService } from '../../../core/services/language.service';


@Component({
   standalone: true,
  selector: 'app-pages',
 
  imports: [
    DocumentListComponent,
    ModalFormComponent,
    // TabsComponent

  ],
  templateUrl: './pages-list.component.html',
  styleUrl: './pages-list.component.scss'
})
export class PagesComponent implements OnInit {
  @ViewChild(ModalFormComponent)
  pageModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(
    private pageService: AuthService,
    private cdr: ChangeDetectorRef,
    // private languageService: LanguageService,
  ) {}

  data: any[] = [];
  tableColumns: TableColumn[] = [];

  formInitialData: any = {};

  isEditMode = false;
  pageId: string | null = null;
  pageSchema = pageSchema;

  ngOnInit(): void {
    this.loadPages();
      console.log('Page Schema:', this.pageSchema);
  }

  loadPages(): void {
    // Replace with your actual API
    this.pageService.getPages({}).subscribe({
      next: (res) => {
        this.data = res.data.map((page:any)=>({
          id: page.id,
          
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.show('error', 'Failed to load pages');
      }
    });
  }
  openCreateModal(): void {
    this.isEditMode = false;
    this.pageId = null;
     this.pageSchema.submitLabel = 'Create Page';

    if (this.pageModal?.dynamicForm) {
      this.pageModal.dynamicForm.form.reset();
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: null },
      queryParamsHandling: 'merge'
    }).then(() => {
      this.pageModal.open();
    });
  }

  openEditModal(id: string | number): void {
    this.isEditMode = true;
    this.pageId = String(id);

    // Replace with your API call
    // this.pageService.getPageById(this.pageId).subscribe({
    //   next: (page) => {
    //     this.pageModal.dynamicForm.form.patchValue(page.data);
    //     this.pageModal.open();
    //   },
    //   error: () => {
    //     this.toast.show('error', 'Failed to load page');
    //   }
    // });

    this.pageModal.open();
  }

  handleAction(event: any): void {
    switch (event.action || event.actionName) {
      case 'edit':
        this.openEditModal(event.row.id);
        break;

      case 'delete':
        // this.deletePage(event.row.id);
        break;
    }
  }

  onSubmit(formData: any): void {

    if (this.isEditMode) {
      // Update Page
      // this.pageService.updatePage(this.pageId, formData)
    } else {
      // Create Page
      // this.pageService.createPage(formData)
    }
  }

  closeModal(): void {
    this.pageModal.close();
  }

  
  onModalClosed(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { public_id: null },
      queryParamsHandling: 'merge'
    });
  }
}