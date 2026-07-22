import { Component, OnInit } from '@angular/core';
import { getTankerSchema, getRigSchema, getExtractionSchema } from './calculator.schema';
import { ActivatedRoute } from '@angular/router';
import { CalculatorTemplateComponent, ResultRow } from '../../../../shared/components/calculator-template/calculator-template.component';
// import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';


@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [CalculatorTemplateComponent], 
  templateUrl: './calculator-page.component.html',
})
export class CalculatorPageComponent implements OnInit {
  

  currentType: string | null = '';
  calculatorTitle: string = '';
  resultTitle: string = '';
  currentSchema: any = null; 
  resultRows: ResultRow[] = [];
  addedItemsList: any[] = []; // Replaces addedTankers
  listHeaders: string[] = [];
  listKeys: string[] = [];


  totalAmount: string = '₹ 0';
  initialFormData: any = null;
  showResults: boolean = false
 
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentType = params.get('type');
      this.loadCalculatorConfig(this.currentType);
    });
  }

  private loadCalculatorConfig(type: string | null): void {
    this.resultRows = []; 
    this.totalAmount = '₹ 0';

    switch (type) {
      case 'water-tanker':
        
        this.calculatorTitle = 'Water Tanker Fee Calculator';
        this.resultTitle = 'Calculation of Fresh water for Existing unit (Tanker)';
          this.listHeaders = ['Operation Date', 'Zone', 'Trips/Month', 'Capacity (m3)'];
           this.listKeys = ['wtOperationDate', 'zone', 'tripsPerMonth', 'capacity'];
        this.currentSchema = this.getTankerSchema(); 
        this.initialFormData={
          publicationDate: '01-02-2023',
          numberOfWaterTankers: 1,
          tripsPerMonth: 20,
        }
        break;

      case 'drilling-rig':
        this.calculatorTitle = 'Drilling Rig Fee Calculator';
        this.resultTitle = 'Calculation for Drilling Rig Permission';
        this.currentSchema = this.getRigSchema(); 
         this.listHeaders = ['Operation Date'];
        this.listKeys = ['rigOperationDate'];
         this.initialFormData = {
          publicationDate: '01-02-2023',
          numberOfRigs: 1
        };
        break;

      case 'gw-extraction':
        this.listHeaders = [];
        this.listKeys = [];
        this.addedItemsList = [];
        this.calculatorTitle = 'Fee Calculator ';
        this.resultTitle = 'Calculation of GW Extraction Charges';
        this.currentSchema = this.getExtractionSchema(); 
        this.initialFormData={
          publicationDate: '01-02-2023',
          abandonedTubeWells: 0,
          freshWaterVolume: 0,
        }
        break;

      default:
        this.calculatorTitle = 'Calculator Not Found';
        this.currentSchema = null;
    }
  }

 // ==========================================
  // THE TRAFFIC COP
  // ==========================================
  onCalculate(formData: any): void {

    this.showResults = true; 

    if (this.currentType === 'water-tanker') {
      this.calculateTanker(formData);
    } else if (this.currentType === 'drilling-rig') {
      this.calculateRig(formData);
    } else if (this.currentType === 'gw-extraction') {
      this.calculateExtraction(formData);
    }
    
  }
  goBack(): void {
      this.showResults = false;}

  // ==========================================
  // 1. WATER TANKER LOGIC
  // ==========================================
   private calculateTanker(formData: any): void {
    this.resultTitle = 'Calculation of Fresh water for Existing unit (Tanker)';
     let tankersToCalculate = [...this.addedItemsList];
        if (formData.capacity || formData.wtOperationDate) {
      tankersToCalculate.push(formData);
    }

    let totalTrips = 20;
    this.addedItemsList.forEach(tanker => {
      totalTrips += Number(tanker.tripsPerMonth || 0);
    });
     

    const total = 2500 + (totalTrips * 100);

    const tankerDetails = this.addedItemsList.map((t, i) => 
      `Tanker ${i + 1} - Operation: ${t.wtOperationDate || 'N/A'}, Capacity: ${t.capacity || 'N/A'}`
    );
    

    this.resultRows = [
      { srNo: 1, purpose: 'Application Fees', details: ['₹ 2,500'] },
      { 
        srNo: 2, 
        purpose: 'Dates & Details', 
        details: [
          `Direction Published Date : ${formData.publicationDate || 'N/A'}`,
          `Application Date : ${formData.applicationDate || 'N/A'}`,
          ...tankerDetails 
        ] 
      },
      { srNo: 3, purpose: 'Ground Water Conveyance', details: [`Not Due`] },
      { srNo: 4, purpose: 'Usage Charges', details: [`${totalTrips} total trips @ ₹100 = ₹${totalTrips * 100}`] },
    ];
    
    this.totalAmount = `₹ ${total.toLocaleString('en-IN')}`;
  }


  // ==========================================
  // 2. DRILLING RIG LOGIC
  // ==========================================
    private calculateRig(formData: any): void {
    this.resultTitle = 'Result'; // From screenshot
    
    let rigsToCalculate = [...this.addedItemsList];
    if (formData.rigOperationDate) {
      rigsToCalculate.push(formData);
    }

    const applicationFee = 10000;
    let nccCharges = 0;
    
    let datesDetails = [
      `Publication Date : ${formData.publicationDate || '01-02-2023'}`,
      `Date Of Application : ${formData.applicationDate || 'N/A'}`
    ];
    
    let nccDetails = [];

    rigsToCalculate.forEach((rig, index) => {
      datesDetails.push(`Drilling Rig ${index + 1} Operation Date : ${rig.rigOperationDate || 'N/A'}`);
      
      let rigCharge = 10000; 
      nccCharges += rigCharge;

      nccDetails.push(`Delay Charges for Drilling Rig ${index + 1}`);
      nccDetails.push(`Charges Till Date =`);
      nccDetails.push(`1 Month(s) x ₹ 10000`);
      nccDetails.push(`₹ ${rigCharge.toLocaleString()}`);
      nccDetails.push(``); 
    });
    
    nccDetails.push(`Total Charges = ₹ ${nccCharges.toLocaleString()}`);

    const grandTotal = applicationFee + nccCharges;

    this.resultRows = [
      { srNo: 1, purpose: 'Application Fees', details: [`₹ ${applicationFee.toLocaleString()}`] },
      { srNo: 2, purpose: 'Dates', details: datesDetails },
      { srNo: 3, purpose: 'Other NCC Charges', details: nccDetails }
    ];
    
    this.totalAmount = `₹ ${grandTotal.toLocaleString('en-IN')}`;
  }


  // ==========================================
  // 3. GW EXTRACTION LOGIC
  // ==========================================
  private calculateExtraction(formData: any): void {
    this.resultTitle = 'Calculation of GW Extraction Charges';
    
    this.resultRows = [
      { srNo: 1, purpose: 'Volume of Water', details: ['Fresh: 350 m³', 'Drinking & Domestic: 100 m³', 'Total Volume: 450 m³'] },
      { srNo: 2, purpose: 'Application Fees', details: ['₹ 1,000'] },
      { srNo: 3, purpose: 'Registration Of Extraction Structure', details: ['Proposed: 2', '500 × 2 = ₹ 1,000'] },
      { srNo: 4, purpose: 'Security Deposit', details: ['Total Security: 0 × 2 Month(s) = ₹ 0'] }
    ];
    this.totalAmount = '₹ 2,000';
  }

    onCustomAction(event: any) {
    if (event.action === 'add_tanker') {
      
      this.addedItemsList.push({ 
        publicationDate: this.initialFormData.publicationDate, 
        ...event.formValue 
      });
      
      this.initialFormData = {
        ...this.initialFormData,
        ...event.formValue,
        wtOperationDate: null,
        capacity: null, 
        numberOfWaterTankers: this.addedItemsList.length + 1,
        tripsPerMonth: 20 
      };

    } else if (event.action === 'add_rig') {
      
      this.addedItemsList.push({ 
        publicationDate: this.initialFormData.publicationDate, 
        ...event.formValue 
      });
      
      this.initialFormData = {
        ...this.initialFormData,
        ...event.formValue,
        rigOperationDate: null, 
        numberOfRigs: this.addedItemsList.length + 1
      };

    }else if (event.action === 'save_inline_edit') {
       
       this.addedItemsList[event.index] = {
          ...this.addedItemsList[event.index],
          ...event.data
       };
       } else if (event.action === 'remove_item') {
      this.addedItemsList.splice(event.index, 1);
      
      if (this.currentType === 'water-tanker') {
         this.initialFormData = {
           ...this.initialFormData,
           numberOfWaterTankers: this.addedItemsList.length > 0 ? this.addedItemsList.length : 1 
         };
      } else if (this.currentType === 'drilling-rig') {
         this.initialFormData = {
           ...this.initialFormData,
           numberOfRigs: this.addedItemsList.length > 0 ? this.addedItemsList.length : 1 
         };
      }
    }
  }



  private getTankerSchema() { return getTankerSchema(); }
  private getRigSchema() { return getRigSchema(); }
  private getExtractionSchema() { return getExtractionSchema(); }

}