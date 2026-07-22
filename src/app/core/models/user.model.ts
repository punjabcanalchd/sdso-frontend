export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  roleId: string;
  roleName: string;
  roleSlug: string;
  currentUserRole: string | null;

//if applied for profile
  applicantType?: string;
  fatherName?: string;
  designation?: string;
  idProof?: string | number;
  idProofNumber?: string;

}