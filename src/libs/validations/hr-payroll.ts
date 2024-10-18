import { z } from 'zod';

const recordSchema = z.object({
  totalPaid: z.number(),
  totalUnpaid: z.number(),
  totalPaidAmount: z.number(),
  totalIncrementAmount: z.number(),
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
};
