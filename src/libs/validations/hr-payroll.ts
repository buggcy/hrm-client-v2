import { z } from 'zod';

export const payStatus = ['Paid', 'Unpaid'] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const empIdSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  Avatar: z.string().optional(),
});

const payrollIncrementSchema = z.object({
  title: z.string(),
  amount: z.number(),
  date: z.string(),
  _id: z.string(),
});

const HRPayrollSchema = z.object({
  _id: z.string(),
  Emp_ID: empIdSchema,
  User_ID: z.string().optional(),
  Employee_Name: z.string().optional(),
  Date: z.string().optional(),
  Basic_Salary: z.number().optional(),
  Increments: z.array(payrollIncrementSchema).optional(),
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
  Pay_Status: z.enum(payStatus).optional(),
  Paid_Amount: z.number().optional(),
  Working_Days: z.number().optional(),
  isDeleted: z.boolean().optional(),
  __v: z.number().optional(),
  amountToBePaid: z.number().optional(),
});

const HRPayrollApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(HRPayrollSchema),
});

export type HRPayrollApiResponse = z.infer<typeof HRPayrollApiResponseSchema>;
export type HRPayrollListType = z.infer<typeof HRPayrollSchema>;

export {
  HRPayrollSchema,
  HRPayrollApiResponseSchema,
  empIdSchema,
  payrollIncrementSchema,
  paginationSchema,
};
