export type VerifyEmployeeType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  uniqueCode: string;
  roleId: number;
  isApproved: 'Approved' | 'Pending' | 'Rejected';
  companyEmail: string;
  Designation: string;
  position: Position[];
  Joining_Date: string;
  Ed_Exp_ID: string[];
  dep_ID: string[];
  isDeleted: boolean;
  Address: Address;
  basicSalary: number;
  activeStatus: boolean;
  UniqueCodeExpire: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  Blood_Group?:
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'O+'
    | 'O-'
    | 'AB+'
    | 'AB-'
    | undefined;
  DOB: string;
  Emergency_Phone: string;
  Family_Name: string;
  Family_Occupation: string;
  Family_PhoneNo: string;
  Family_Relation: string;
  Gender: 'male' | 'female';
  Marital_Status: 'married' | 'unmarried';
  Nationality: string;
  rejectedReason: string;
};

export type Position = {
  position: string;
  isCurrent: boolean;
  _id: string;
  timestamp: string;
};

export type Address = {
  city: string;
  street: string;
  province: string;
  landMark: string;
  country: string;
  zip: string;
  full: string;
  _id: string;
};

export type VerifyKYCType = {
  cnic: CNICDetails;
  bankDetails: BankDetails;
  _id: string;
  userId: string;
  createdAt: string;
  __v: number;
};

export type CNICDetails = {
  number: string;
  frontPicture: string | undefined | File;
  backPicture: string | undefined | File;
};

export type BankDetails = {
  branchName: string;
  accountHolderName: string;
  accountNumber: string;
  iban: string;
};

export type VerifyEducationExperienceType = {
  _id: string;
  user_id: string;
  type: 'education' | 'experience' | undefined;
  Start_Date: string;
  End_Date: string;
  Document: string;
  documentType: string;
  referenceNumber: string;
  Institute: string;
  Position: string;
  isDeleted: boolean;
  __v: number;
};

export type VerifyAdditionalDocumentsType = {
  _id: string;
  user_id: string;
  Document: string[];
  __v: number;
};

export type VerifyCodeResponseType = {
  employee: VerifyEmployeeType;
  kyc: VerifyKYCType;
  educationExperiences: VerifyEducationExperienceType[];
  additionalDocuments: VerifyAdditionalDocumentsType;
};
