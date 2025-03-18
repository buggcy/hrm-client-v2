import { z } from 'zod';

export const payStatus = ['Paid', 'Unpaid'] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});
const depIdSchema = z.array(
  z.object({
    _id: z.string(),
    departmentName: z.string(),
  }),
);

const empIdSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  Avatar: z.string().optional(),
  Designation: z.string().optional(),
  dep_ID: depIdSchema.optional(),
});

const payrollIncrementSchema = z.object({
  title: z.string(),
  amount: z.number(),
  date: z.string(),
  _id: z.string(),
});

const HRPayrollSchema = z.object({
  _id: z.string(),
  Emp_ID: empIdSchema.nullable(),
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
  Leaves: z
    .object({
      casual: z.number().optional(),
      sick: z.number().optional(),
      annual: z.number().optional(),
    })
    .optional(),
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
  casualLeaves: z.number().optional(),
  sickLeaves: z.number().optional(),
  annualLeaves: z.number().optional(),
  perks: z
    .object({
      increments: z.array(
        z.object({
          name: z.string(),
          amount: z.number(),
        }),
      ),
      decrements: z.array(
        z.object({
          name: z.string(),
          amount: z.number(),
        }),
      ),
    })
    .optional(),
  totalPerkDecrement: z.number().optional(),
  totalPerkIncrement: z.number().optional(),
  overtimeMinute: z.number().optional(),
  totalOvertime: z.number().optional(),
});

const HRPayrollApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(HRPayrollSchema),
});

export type HRPayrollApiResponse = z.infer<typeof HRPayrollApiResponseSchema>;
export type HRPayrollListType = z.infer<typeof HRPayrollSchema>;

const recordSchema = z.object({
  totalPaid: z.number(),
  totalUnpaid: z.number(),
  totalPaidAmount: z.number(),
  totalPerkAmount: z.number(),
  totalAmountTobePaid: z.number(),
  totalSalaryDeduction: z.number(),
});

const chartDataSchema = z.object({
  month: z.string(),
  Net_Salary: z.number(),
  Tax_Amount: z.number(),
  Basic_Salary: z.number(),
});

const trendDataSchema = z.object({
  month: z.string(),
  Total_Working_Minutes: z.number(),
  Total_Remaining_Minutes: z.number(),
  Total_Absent_Deduction: z.number(),
});

const payrollRecordApiResponseSchema = z.object({
  records: recordSchema,
  chartData: z.array(chartDataSchema),
  trendData: z.array(trendDataSchema),
});

export type PayrollRecordApiResponse = z.infer<
  typeof payrollRecordApiResponseSchema
>;
export type MonthlyPayrollChartType = z.infer<typeof chartDataSchema>;
export type MonthlyPayrollChartArrayType =
  | z.infer<typeof chartDataSchema>[]
  | [];

export type PayrollTrendChartType = z.infer<typeof trendDataSchema>;
export type PayrollTrendChartArrayType = z.infer<typeof trendDataSchema>[] | [];

export {
  recordSchema,
  payrollRecordApiResponseSchema,
  chartDataSchema,
  trendDataSchema,
  HRPayrollSchema,
  HRPayrollApiResponseSchema,
  empIdSchema,
  payrollIncrementSchema,
  paginationSchema,
};
