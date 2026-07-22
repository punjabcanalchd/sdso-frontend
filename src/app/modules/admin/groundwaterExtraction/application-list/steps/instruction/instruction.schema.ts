import { FormSchema } from '../../../../../../core/models/form-schema.model';


export const instructionSchema: FormSchema = {
  isMultiFormWizard: true,
  fields: [
    {
      type: 'html',
      name: 'instruction',
      label: '',
      html: `
       <div class="bg-light bg-opacity-50 p-4 rounded-3 border-start border-warning border-4  mb-4">
         <h4 class="fw-bold text-dark mb-3"><i class="bi bi-info-circle text-warning me-2"></i> IMPORTANT POINTS FOR FILLING OF APPLICATION</h4>
        <ol class="text-muted lh-lg mb-4">
        <li>The applicant should go through the <strong>Punjab Groundwater Extraction and Conservation Directions, 2023</strong> carefully before applying.</li>
        <li>The applicant may refer to the notice board, user manuals, FAQs, office orders, and other relevant documents before filling up the application form.</li>
        <li>The User must apply for permission for extraction of groundwater for each of its Units through separate applications.</li>
        <li>The application may be submitted directly by the User or through an Authorized Applicant.</li>
        </ol>

        <h4 class="fw-bold text-dark mb-3"><i class="bi bi-file-earmark-text text-warning me-2"></i> DOCUMENTS REQUIRED</h4>
        <ol class="text-muted lh-lg mb-0">
        <li>Copy of previous permission (Ad-Interim) issued by the Authority, if any.</li>
        <li>Address proof of the Unit (Fard/Registry/Electricity Bill).</li>
        <li>Partnership Deed / Registration Certificate / Letter of Incorporation of Company or Firm, etc.</li>
        <li>ID proof of the Applicant (PAN Card / Valid Driving License).</li>
        <li>Copy of PAN Card of the Unit.</li>
        <li>Copy of GST Identification Number (GSTIN) of the Unit/User (if applicable).</li>
        <li>Authorization Letter / Copy of Resolution by the Competent Authority authorizing the Applicant to apply (if applicable).</li>
        <li>Hydrogeological Report, if permission is sought for extraction of more than <strong>1500 cubic metres</strong> of brackish/saline groundwater per month.</li>
        <li>Chemical Analysis Report of water as per <strong>IS 10500:2012</strong> from a NABL-accredited laboratory (applicable only for existing units extracting <strong>15,000 cubic metres or more per month</strong> of freshwater). The report must not be older than <strong>six months</strong> from the date of application.</li>
        <li>Date and time-stamped photograph showing the reading of Water Meters, if installed, at the time of submission of the application.</li>
        <li>Copy of Water Meter Calibration Certificate (if a water meter is installed).</li>
        <li>Layout Plan showing the location of tube wells.</li>
        </ol>
        <span class="fw-bold">Note:</span> The applicant may be required to submit any other document as required by the Authority.
        </div>
      `
    },
  
  ]
};