export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contactNo: string;
  roleId: number;
  isApproved: string;
  companyEmail: string;
  Designation?: string;
  gender?: string;
  bloodGroup?: string;
  dob?: string;
  nationality?: string;
  maritalStatus?: string;
  emergencyPhone?: string;
  familyRelation?: string;
  familyPhoneNo?: string;
  familyOccupation?: string;
  currentStatus?: string;
  tahometerId?: string;
  profileDescription?: string;
  Ed_Exp_ID?: Array<string>;
  Avatar?: string;
}
