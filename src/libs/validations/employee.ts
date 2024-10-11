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
const emp_Id_Schema = z.object({
  Avatar: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  _id: z.string(),
});
const payrollIncrementSchema = z.object({
  title: z.string(),
  amount: z.number(),
  date: z.string(),
  _id: z.string(),
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

const employeePayrollSchema = z.object({
  _id: z.string(),
  Emp_ID: emp_Id_Schema,
  User_ID: z.string().optional(),
  Employee_Name: z.string().optional(),
  Date: z.string().optional(),
  Basic_Salary: z.number().optional(),
  Tax_Amount: z.number().optional(),
  Absent_Deduction: z.number().optional(),
  Today_Days_Present: z.number().optional(),
  Total_Absent: z.number().optional(),
  Total_Leaves: z.number().optional(),
  Late: z.number().optional(),
  Total_Minutes_Monthly: z.number().optional(),
  Total_Remaining_Minutes: z.number().optional(),
  Net_Salary: z.number().optional(),
  Total_SalaryDeducton: z.number().optional(),
  Total_Working_Minutes: z.number().optional(),
  Pay_Status: z.string().optional(),
  Paid_Amount: z.number().optional(),
  Working_Days: z.number().optional(),
  isDeleted: z.boolean().optional(),
  Increments: z.array(payrollIncrementSchema).optional(),
  __v: z.number().optional(),
  type: z.literal('employeePayroll').optional(),
});

const employeeApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(employeeListSchema),
});
const employeePayrollApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(employeePayrollSchema),
});

export type EmployeeApiResponse = z.infer<typeof employeeApiResponseSchema>;
export type EmployeeListType = z.infer<typeof employeeListSchema>;
export type EmployeeListArrayType = z.infer<typeof employeeListSchema>[] | [];
export type EmployeePayrollListType = z.infer<typeof employeePayrollSchema>;
export type EmployeePayrollArrayType =
  | z.infer<typeof employeePayrollSchema>[]
  | [];

export {
  employeeApiResponseSchema,
  employeeListSchema,
  paginationSchema,
  addressSchema,
  positionSchema,
  employeePayrollSchema,
  employeePayrollApiResponseSchema,
};
