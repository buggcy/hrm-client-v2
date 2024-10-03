import { z } from 'zod';

export const gender = ['male', 'female'] as const;
export const approvalStatus = ['Approved', 'Pending', 'Rejected'] as const;
export const maritalStatus = ['married', 'unmarried'] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

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

const employeeListSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  contactNo: z.string(),
  uniqueCode: z.string().optional(),
  roleId: z.number(),
  companyEmail: z.string().email(),
  Ed_Exp_ID: z.array(z.string()).optional(),
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
  Gender: z.enum(gender).optional(),
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

const employeeApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(employeeListSchema),
});

export type EmployeeApiResponse = z.infer<typeof employeeApiResponseSchema>;
export type EmployeeListType = z.infer<typeof employeeListSchema>;
export type EmployeeListArrayType = z.infer<typeof employeeListSchema>[] | [];

export {
  employeeApiResponseSchema,
  employeeListSchema,
  paginationSchema,
  addressSchema,
  positionSchema,
};
