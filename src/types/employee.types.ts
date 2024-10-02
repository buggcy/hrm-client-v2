export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface Address {
  city?: string;
  street?: string;
  province?: string;
  landMark?: string;
  country?: string;
  zip?: string;
  full?: string;
  _id: string;
}

export interface Position {
  position: string;
  isCurrent: boolean;
  _id: string;
  timestamp: string;
}

export interface EducationExperiences {
  _id: string;
  user_id: string;
  type: string;
  Start_Date: string;
  End_Date: string;
  documentType: string;
  referenceNumber?: string;
  Institute: string;
  Position: string;
  Document?: string;
  isDeleted: boolean;
}

export interface AdditionalDocuments {
  _id: string;
  user_id: string;
  Document?: string[];
  isDeleted: boolean;
}

export interface Kyc {
  _id: string;
  userId: string;
  cnic: {
    number: string;
    frontPicture?: string;
    backPicture?: string;
  };
  bankDetails: {
    branchName: string;
    accountHolderName: string;
    accountNumber: string;
    iban: string;
  };
  createdAt: string;
}

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  uniqueCode: string;
  roleId: number;
  companyEmail: string;
  Ed_Exp_ID: string[];
  dep_ID: string[];
  isDeleted: boolean;
  UniqueCodeExpire: string;
  __v: number;
  Blood_Group?: string;
  DOB?: string;
  Emergency_Phone?: string;
  Family_Name?: string;
  Family_Occupation?: string;
  Family_PhoneNo?: string;
  Family_Relation?: string;
  Gender?: 'male' | 'female';
  Marital_Status?: 'married' | 'unmarried';
  Nationality?: string;
  isApproved: 'Approved' | 'Pending' | 'Rejected';
  password: string;
  rejectedReason: string;
  Avatar?: string | null;
  Current_Status?: string;
  profileDescription?: string;
  Tahometer_ID?: string;
  basicSalary: number;
  activeStatus: boolean;
  updatedAt: string;
  position: Position[];
  Joining_Date?: string | null;
  otp?: string;
  otpExpires?: string;
  Address: Address;
  Designation?: string;
  createdAt?: string;
}

export interface EmployeeApiResponse {
  pagination: Pagination;
  data: Employee[];
}

export interface GetEmployeeByIdResponse {
  output: {
    employee: Employee;
    educationExperiences: EducationExperiences[];
    additionalDocuments: AdditionalDocuments[];
    kyc: Kyc[];
  };
}
