import { Injectable, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OfficeHierarchyService {
  private allOffices: any[] = [];
  private officesLoaded = false;

  constructor(private authService: AuthService) {}

  private updateSchemaField(schemaFields: any[] | undefined, fieldName: string, updatedField: any) {
    if (!schemaFields) return;
    const idx = schemaFields.findIndex((f: any) => f.name === fieldName);
    if (idx > -1) {
      schemaFields[idx] = { ...updatedField };
    }
  }

  setupFormCascading(form: FormGroup, schemaFields: any[], cdr: ChangeDetectorRef) {
    if (!form || !schemaFields) return;

    const officeField = schemaFields.find((f: any) => f.name === 'officecode');

    // 0. Fetch all offices once so we can filter them by ANY level
    if (!this.officesLoaded) {
      this.authService.getOffices().subscribe(res => {
        this.allOffices = res.data;
        this.officesLoaded = true;
        this.updateOfficeDropdown(form, officeField, cdr, schemaFields);
      });
    } else {
      this.updateOfficeDropdown(form, officeField, cdr, schemaFields);
    }

    // 1. Listen for Circle changes
    form.get('circle_id')?.valueChanges.subscribe((circleId: string) => {
      const divisionField = schemaFields.find((f: any) => f.name === 'division_id');
      const subdivisionField = schemaFields.find((f: any) => f.name === 'subdivision_id');

      if (divisionField) {
        divisionField.options = [];
        divisionField.placeholder = 'Please Select Circle First...';
        this.updateSchemaField(schemaFields, 'division_id', divisionField);
      }
      if (subdivisionField) {
        subdivisionField.options = [];
        subdivisionField.placeholder = 'Please Select Division First...';
        this.updateSchemaField(schemaFields, 'subdivision_id', subdivisionField);
      }
      form.patchValue({ division_id: '', subdivision_id: '', officecode: '' }, { emitEvent: false });

      if (circleId) {
        this.authService.getDivisionsByCircle(circleId).subscribe(res => {
          if (divisionField) {
            divisionField.options = res.data.map((d: any) => ({ label: d.name_en, value: d.public_id }));
            divisionField.placeholder = 'Select Division';
            this.updateSchemaField(schemaFields, 'division_id', divisionField);
          }
          cdr.detectChanges();
        });
      }
      this.updateOfficeDropdown(form, officeField, cdr, schemaFields);
    });

    // 2. Listen for Division changes
    form.get('division_id')?.valueChanges.subscribe((divisionId: string) => {
      const subdivisionField = schemaFields.find((f: any) => f.name === 'subdivision_id');

      if (subdivisionField) {
        subdivisionField.options = [];
        subdivisionField.placeholder = 'Please Select Division First...';
        this.updateSchemaField(schemaFields, 'subdivision_id', subdivisionField);
      }
      form.patchValue({ subdivision_id: '', officecode: '' }, { emitEvent: false });

      if (divisionId) {
        this.authService.getSubdivisionsByDivision(divisionId).subscribe(res => {
          if (subdivisionField) {
            subdivisionField.options = res.data.map((s: any) => ({ label: s.name_en, value: s.public_id }));
            subdivisionField.placeholder = 'Select Sub Division';
            this.updateSchemaField(schemaFields, 'subdivision_id', subdivisionField);
          }
          cdr.detectChanges();
        });
      }
      this.updateOfficeDropdown(form, officeField, cdr, schemaFields);
    });

    // 3. Listen for Subdivision changes
    form.get('subdivision_id')?.valueChanges.subscribe(() => {
      form.patchValue({ officecode: '' }, { emitEvent: false });
      this.updateOfficeDropdown(form, officeField, cdr, schemaFields);
    });

    // 4. Listen for Office Level changes
    form.get('officelevelcode')?.valueChanges.subscribe(() => {
      form.patchValue({ 
        circle_id: '', 
        division_id: '', 
        subdivision_id: '', 
        officecode: '' 
      }, { emitEvent: false });
      
      this.updateOfficeDropdown(form, officeField, cdr, schemaFields);
    });

    // 5. Listen for Office changes to auto-select district
    form.get('officecode')?.valueChanges.subscribe((officecode: string) => {
      const districtControl = form.get('district_code');
      if (officecode && this.allOffices.length > 0) {
        const selectedOffice = this.allOffices.find(o => o.public_id === officecode);
        if (selectedOffice && selectedOffice.district_code) {
          districtControl?.patchValue(selectedOffice.district_code, { emitEvent: false });
          districtControl?.disable({ emitEvent: false });
          cdr.detectChanges();
        } else {
          districtControl?.enable({ emitEvent: false });
        }
      } else {
        districtControl?.enable({ emitEvent: false });
      }
    });

    // 6. Trigger initial load if editing a user
    const existingCircleId = form.get('circle_id')?.value;
    const existingDivisionId = form.get('division_id')?.value;
    const existingOfficeCode = form.get('officecode')?.value;

    if (existingCircleId) {
      const divisionField = schemaFields.find((f: any) => f.name === 'division_id');
      this.authService.getDivisionsByCircle(existingCircleId).subscribe(res => {
        if (divisionField) {
          divisionField.options = res.data.map((d: any) => ({ label: d.name_en, value: d.public_id }));
          divisionField.placeholder = 'Select Division';
          this.updateSchemaField(schemaFields, 'division_id', divisionField);
        }
        cdr.detectChanges();
      });
    }

    if (existingDivisionId) {
      const subdivisionField = schemaFields.find((f: any) => f.name === 'subdivision_id');
      this.authService.getSubdivisionsByDivision(existingDivisionId).subscribe(res => {
        if (subdivisionField) {
          subdivisionField.options = res.data.map((s: any) => ({ label: s.name_en, value: s.public_id }));
          subdivisionField.placeholder = 'Select Sub Division';
          this.updateSchemaField(schemaFields, 'subdivision_id', subdivisionField);
        }
        cdr.detectChanges();
      });
    }

    // Auto-fill district initially if office is pre-selected
    if (existingOfficeCode && this.officesLoaded) {
      const selectedOffice = this.allOffices.find(o => o.public_id === existingOfficeCode);
      if (selectedOffice && selectedOffice.district_code) {
        const districtControl = form.get('district_code');
        districtControl?.patchValue(selectedOffice.district_code, { emitEvent: false });
        districtControl?.disable({ emitEvent: false });
      }
    }
  }

  private updateOfficeDropdown(form: FormGroup, officeField: any, cdr: ChangeDetectorRef, schemaFields?: any[]) {
    if (!officeField) return;

    const officeLevel = form.get('officelevelcode')?.value;
    const circleId = form.get('circle_id')?.value;
    const divisionId = form.get('division_id')?.value;
    const subdivisionId = form.get('subdivision_id')?.value;

    let filteredOffices = this.allOffices;

    // First filter by hierarchy ID if present
    if (subdivisionId) {
      filteredOffices = this.allOffices.filter(o => o.subdivision_id === subdivisionId);
    } else if (divisionId) {
      filteredOffices = this.allOffices.filter(o => o.division_id === divisionId);
    } else if (circleId) {
      filteredOffices = this.allOffices.filter(o => o.circle_id === circleId);
    } else if (officeLevel) {
      // Safely convert to string and handle both name (e.g. 'SUB DIVISION OFFICE') and code/public_id
      const targetLevel = String(officeLevel).trim().toUpperCase();
      filteredOffices = this.allOffices.filter(o => {
        const oLevelName = o.officelevel ? String(o.officelevel).trim().toUpperCase() : '';
        const oLevelCode = o.officelevelcode ? String(o.officelevelcode).trim().toUpperCase() : '';
        return (oLevelName && oLevelName === targetLevel) || (oLevelCode && oLevelCode === targetLevel);
      });
    }


    // If the selected hierarchy level has no offices associated with it yet,
    // fallback to showing all offices so the user can still proceed.
    if (filteredOffices.length === 0) {
      filteredOffices = this.allOffices;
    }

    // Re-assign a new array reference to force Angular change detection
    officeField.options = [...filteredOffices.map((o: any) => ({ label: o.name_en, value: o.public_id }))];
    officeField.placeholder = 'Select Office';
    
    this.updateSchemaField(schemaFields, 'officecode', officeField);
    
    cdr.detectChanges();
  }
}