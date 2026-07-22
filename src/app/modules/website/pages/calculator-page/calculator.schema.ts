import { FormSchema } from '../../../../core/models/form-schema.model';

export const getStandardButtons = (addActionString?: string, includeReset: boolean = false): any[] => {
  const buttons: any[] = [];

  //  Reset Button (Only if includeReset is true)
  if (includeReset) {
    buttons.push({
      label: 'Reset',
      action: 'reset',
      overrideClasses: true,
      class: 'btn btn-primary-govt px-4 align-self-end mb-2'
    });
  }

  buttons.push({
    label: 'Calculate',
    action: 'calculate',
    overrideClasses: true,
    class: 'btn btn-primary-govt px-5 align-self-center mb-3'
  });

  return buttons;
};

export const getTankerSchema = (): FormSchema => {
  return {
    title: '',
    // layoutStyle: 'popup',
    showCustomButtons: true,
      addActionString: 'add_tanker',
    buttonContainerClass: 'd-flex justify-content-center w-100 mt-0',
    buttons: getStandardButtons('add_tanker'),
    fields: [
      {
        name: 'publicationDate',
        label: 'Publication Date',
        type: 'text',
        defaultValue: '01-02-2023',
        readonly: true,
        disabled: true,
        className: 'col-md-6',
      },
      {
        name: 'applicationDate',
        label: 'Application Date',
        type: 'datepicker',
        className: 'col-md-6 ',
      },
      {
        name: 'numberOfWaterTankers',
        label: 'Number of Water Tankers',
        type: 'number',
        defaultValue: 1,
        readonly: true,
        disabled: true,
        className: 'col-md-6 '
      },
      {
        name: 'tripsPerMonth',
        label: 'Trips Per Month',
        type: 'number',
        defaultValue: 20,
        readonly: true,
        disabled: true,
        className: 'col-md-6',
      },
      {
        name: 'wtOperationDate',
        label: 'WT Operation Date',
        type: 'datepicker',
        className: 'col-md-4',
      },
      {
        name: 'zone',
        label: 'Zone',
        type: 'select',
        placeholder: 'Please Select',
        options: [
          { label: 'GREEN', value: 'green' },
          { label: 'YELLOW', value: 'yellow' },
          { label: 'ORANGE', value: 'orange' },
          { label: 'RED', value: 'red' }
        ],
        className: 'col-md-4',
      },
      {
        name: 'capacity',
        label: 'Capacity of WT (m3)',
        type: 'number',
        className: 'col-md-4',
        
      }
    ]
  };
};

export const getRigSchema = (): FormSchema => {
  return {
    // layoutStyle: 'popup',
    showCustomButtons: true,
    addActionString: 'add_rig',
    buttonContainerClass: 'd-flex justify-content-center w-100 mt-0',
    buttons: getStandardButtons('add_rig'),
    fields: [
      {
        name: 'publicationDate',
        label: 'Publication Date',
        type: 'text',
        defaultValue: '01-02-2023',
        readonly: true,
        disabled: true,
        className: 'col-md-6'
      },
      {
        name: 'applicationDate',
        label: 'Date of Application',
        type: 'datepicker',
        className: 'col-md-6'
      },
      {
        name: 'numberOfRigs',
        label: 'Number of Drilling Rigs',
        type: 'number',
        readonly: true,
        disabled: true,
        className: 'col-md-6'
      },
      {
        name: 'rigOperationDate',
        label: 'Date of Operation Drilling Rig',
        type: 'datepicker',
        className: 'col-md-6'
      }
    ]
  };
};

export const getExtractionSchema = (): FormSchema => {
  return {
    // layoutStyle: 'popup',
    showCustomButtons: true,
    buttonContainerClass: 'd-flex flex-column w-100 mt-0',
    buttons: getStandardButtons(undefined, true),
    fields: [
      {
        name: 'unitType',
        label: 'Type of Unit',
        type: 'select',
        options: [
          { label: 'Industrial', value: 'Industrial' },
          { label: 'Commercial', value:'Commercial'},
          { label: 'Institutional', value:'Institutional'},
          { label: 'Housing Infrastructure', value: 'Housing Infrastructure' },
          { label: 'Mining', value: 'Mining' },
          { label: 'Others', value: 'Others' }
        ],
        className: 'col-md-6 '
      },
      {
        name: 'publicationDate',
        label: 'Directions Published Date',
        type: 'text',
        readonly: true,
        disabled: true,
        className: 'col-md-6'
      },
      {
        name: 'existingTubeWells',
        label: 'Existing Tube-Wells',
        type: 'number',
        className: 'col-md-6'
      },
      {
        name: 'proposedTubeWells',
        label: 'Proposed Tube-Wells',
        type: 'number',
        className: 'col-md-6'
      },
      {
        name: 'applicationDate',
        label: 'Date of Application',
        type: 'datepicker',
        className: 'col-md-6'
      },
      {
        name: 'waterType',
        label: 'Water Type',
        type: 'select',
        options: [
          { label: 'Fresh Water', value: 'fresh' },
          { label: 'Saline Water', value: 'saline' }
        ],
            visibleWhen: { field: 'unitType', value: ['', 'Industrial', 'Mining', 'Infrastructure','Institutional'] },
        className: 'col-md-6'
      },
      {
        name: 'freshWaterVolume',
        label: 'Fresh Water Volume Applied for m³/month',
        type: 'number',
        visibleWhen: { field: 'unitType', value: ['Housing Infrastructure', 'Industrial', 'Mining', 'Infrastructure', 'Institutional'] },
        className: 'col-md-6'
      },
      {
        name: 'drinkingWaterVolume',
        label: 'Drinking and Domestic Usage : m³ per month',
        type: 'number',
        visibleWhen: { field: 'unitType', value: 'Housing Infrastructure' },
        className: 'col-md-6'
      },
      {
        name: 'abandonedTubeWells',
        label: 'Abandoned Tube-Wells',
        type: 'number',
        className: 'col-md-6'
      },
      {
        name: 'zone',
        label: 'Zone of Unit',
        type: 'select',
        options: [
          { label: 'GREEN', value: 'GREEN' },
          { label: 'YELLOW', value: 'YELLOW' },
          { label: 'ORANGE', value: 'ORANGE' },
          { label: 'RED', value: 'RED' }
        ],
        className: 'col-md-6'
      }
    ]
  };
};
