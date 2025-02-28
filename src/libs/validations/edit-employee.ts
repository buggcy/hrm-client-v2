import { z } from 'zod';

export const gender = ['male', 'female'] as const;
export const approvalStatus = [
  'Approved',
  'Pending',
  'Rejected',
  'tba',
] as const;
export const maritalStatus = ['married', 'unmarried'] as const;
export const bloodgroupStatus = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
] as const;

const addressSchema = z
  .object({
    city: z.string().optional(),
    street: z.string().optional(),
    province: z.string().optional(),
    landMark: z.string().optional(),
    country: z.string().optional(),
    zip: z.string().optional(),
    full: z.string().optional(),
    _id: z.string(),
  })
  .optional();

const positionSchema = z.object({
  position: z.string(),
  isCurrent: z.boolean(),
  _id: z.string(),
  timestamp: z.string(),
});

const educationExpereinceSchema = z.object({
  _id: z.string(),
  __v: z.number(),
  user_id: z.string(),
  type: z.enum(['education', 'experience']),
  referenceNumber: z.string().optional(),
  isDeleted: z.boolean(),
  documentType: z.string(),
  Start_Date: z.string(),
  Position: z.string(),
  Institute: z.string(),
  End_Date: z.string(),
  Document: z.string(),
});

const employeeSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  contactNo: z.string(),
  uniqueCode: z.string().optional(),
  roleId: z.number(),
  companyEmail: z.string().email(),
  Ed_Exp_ID: z.array(educationExpereinceSchema).optional(),
  dep_ID: z.array(z.string()).optional(),
  isDeleted: z.boolean().optional(),
  UniqueCodeExpire: z.string().optional(),
  Blood_Group: z.string().optional(),
  DOB: z.string().optional(),
  Emergency_Phone: z.string().optional(),
  Family_Name: z.string().optional(),
  Family_Occupation: z.string().optional(),
  Family_PhoneNo: z.string().optional(),
  Family_Relation: z.string().optional(),
  Gender: z.string().optional(),
  Marital_Status: z.enum(maritalStatus).optional(),
  Nationality: z.string().optional(),
  isApproved: z.enum(approvalStatus),
  password: z.string().optional(),
  rejectedReason: z.string().optional(),
  Avatar: z.string().nullable().optional(),
  Current_Status: z.string().optional(),
  profileDescription: z.string().optional(),
  Tahometer_ID: z.string().optional(),
  basicSalary: z.number(),
  desiredSalary: z.number().optional(),
  activeStatus: z.boolean().optional(),
  updatedAt: z.string(),
  position: z.array(positionSchema).optional(),
  Joining_Date: z.string().nullable().optional(),
  otp: z.string().optional(),
  otpExpires: z.string().optional(),
  Address: addressSchema,
  Designation: z.string().optional(),
  createdAt: z.string().optional(),
  __v: z.number().optional(),
  type: z.literal('employee').optional(),
});

const cnicSchema = z.object({
  number: z.string(),
  backPicture: z.string().optional(),
  frontPicture: z.string().optional(),
});

const bankDetailsSchema = z.object({
  accountHolderName: z.string(),
  accountNumber: z.string(),
  branchName: z.string(),
  iban: z.string(),
});

const kycSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  __v: z.number(),
  cnic: cnicSchema,
  bankDetails: bankDetailsSchema,
});

const additionalDocumentsSchema = z.object({
  _id: z.string(),
  __v: z.number(),
  user_id: z.string(),
  Document: z.array(z.string()),
});

const incrementRecordSchema = z.object({
  title: z.string(),
  amount: z.number(),
  desiredSalary: z.number().optional(),
  date: z.string(),
  _id: z.string(),
});

const salarySchema = z.object({
  incrementRecords: z.array(incrementRecordSchema),
});

export type EmployeeType = z.infer<typeof employeeSchema>;
export type KycType = z.infer<typeof kycSchema>;
export type EducationExperienceType = z.infer<typeof educationExpereinceSchema>;
export type AdditionalDocumentType = z.infer<typeof additionalDocumentsSchema>;
export type IncrementRecordType = z.infer<typeof incrementRecordSchema>;
export type SalaryType = z.infer<typeof salarySchema>;
export type DesignationType = z.infer<typeof positionSchema>;
export type AddressType = z.infer<typeof addressSchema>;

const countrySchema = z.object({
  id: z.number(),
  name: z.string(),
  iso2: z.string(),
});

const citySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const countryApiResponseSchema = z.array(countrySchema);
export const cityApiResponseSchema = z.array(citySchema);

export type CountryApiResponse = z.infer<typeof countryApiResponseSchema>;
export type CityApiResponse = z.infer<typeof cityApiResponseSchema>;

const employeeDataApiResponseSchema = z.object({
  message: z.string(),
  output: z.object({
    employee: employeeSchema,
    kyc: z.array(kycSchema),
    educationExperiences: z.array(educationExpereinceSchema),
    additionalDocuments: z.array(additionalDocumentsSchema),
  }),
});

export type EmployeeDataApiResponse = z.infer<
  typeof employeeDataApiResponseSchema
>;

export { employeeSchema, employeeDataApiResponseSchema, salarySchema };
