import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface ModalConfig {
  modalRef: any;            
  schema?: any;            
  submitLabel?: string;     
  patchData?: any;        
  
 
  useRouting?: boolean;
  route?: ActivatedRoute;
  queryParamId?: string | number | null;
  

  onOpen?: () => void;    
}

@Injectable({ providedIn: 'root' })
export class ModalHelperService {
  private router = inject(Router);

  openModal(config: ModalConfig) {
    
    if (config.schema && config.submitLabel) {
      config.schema.submitLabel = config.submitLabel;
    }

    if (config.modalRef?.dynamicForm) {
        config.modalRef.dynamicForm.currentStep = 0;
      config.modalRef.dynamicForm.form.reset(config.patchData || {});
    }

    if (config.useRouting && config.route) {
      this.router.navigate([], {
        relativeTo: config.route,
        queryParams: { id: config.queryParamId },
        queryParamsHandling: 'merge'
      }).then(() => this.triggerOpen(config));
    } else {
      this.triggerOpen(config);
    }
  }

  private triggerOpen(config: ModalConfig) {
    config.modalRef.open();
    if (config.onOpen) {
      setTimeout(() => config.onOpen!(), 100);
    }
  }
}
