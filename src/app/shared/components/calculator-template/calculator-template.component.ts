import { Component, EventEmitter, Input, Output,ViewChild } from '@angular/core';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { DetailsModalComponent, DetailItem } from '../details-modal/details-modal.component';


export interface ResultRow {
  srNo: number;
  purpose: string;
  details: string[];
}

@Component({
  selector: 'app-calculator-template',
  standalone: true,
  imports: [DynamicFormComponent, DetailsModalComponent],
  templateUrl: './calculator-template.component.html'
})
export class CalculatorTemplateComponent {

  @Input() resultTitle: string = 'Calculation Result';
  @Input() resultRows: ResultRow[] = [];
  @Input() totalAmount: string = '₹ 0';
  @Input() calculatorTitle: string = 'Fee Calculator';
  @Input() schema: any = null;
  @Input() initialData: any = null;

  @Input() showResults: boolean = false;
  @Input() addedItems: any[] = [];
  @Input() addedItemsHeaders: string[] = [];
  @Input() addedItemsKeys: string[] = [];

  @Output() customAction = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  @Output() calculate = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) dynamicFormComp!: DynamicFormComponent;

    editingIndex: number = -1;

  onSubmit(formData: any) {
    this.calculate.emit(formData);
  }

    @ViewChild('detailsModal') detailsModal!: DetailsModalComponent;
  selectedItemDetails: DetailItem[] = [];

  viewItemDetails(index: number) {
    const item = this.addedItems[index];
    
    this.selectedItemDetails = this.addedItemsKeys.map((key, i) => ({
      label: this.addedItemsHeaders[i],
      value: item[key]
    }));
    
    this.detailsModal.open();
  }

  getMappedDetails(item: any): DetailItem[] {
    const details: DetailItem[] = [];
    
    const ignoreFields = ['publicationDate', 'applicationDate', 'numberOfWaterTankers', 'numberOfRigs'];
    
    if (this.schema && this.schema.fields) {
      this.schema.fields.forEach((field: any) => {
        
        if (ignoreFields.includes(field.name)) {
          return;
        }

        if (field.name && item[field.name] !== undefined && item[field.name] !== null && item[field.name] !== '') {
          let displayValue = item[field.name];
          
          if ((field.type === 'date' || field.type === 'datepicker') && typeof displayValue === 'string') {

            const parts = displayValue.split('-');
            if (parts.length === 3 && parts[0].length === 4) {
               displayValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }
          details.push({ label: field.label, value: displayValue });
        }
      });
    }
    return details;
  }


  onCustomButtonClick(event: any) {
    if (event.action === 'calculate') {
      this.calculate.emit(event.formValue);
    } else {
      this.customAction.emit(event);
    }

   
  }
    triggerManualAdd() {
    if (this.dynamicFormComp && this.dynamicFormComp.form) {
      const actionName = this.schema.addActionString;
      
      this.customAction.emit({ 
        action: actionName, 
        formValue: this.dynamicFormComp.form.getRawValue() 
      });
    }
  }

     cachedInlineSchema: any = null;
  getInlineEditSchema(): any {
     if (this.cachedInlineSchema) {
      return this.cachedInlineSchema;
    }
    const ignoreFields = ['publicationDate', 'applicationDate', 'numberOfWaterTankers', 'numberOfRigs'];
    
    const editableFields = this.schema?.fields?.filter((f: any) => !ignoreFields.includes(f.name)) || [];
    
     this.cachedInlineSchema = {
       submitLabel: 'Save Changes',
      submitIcon: 'bi bi-save',
      fields: editableFields
    };
    return this.cachedInlineSchema;
  }

}