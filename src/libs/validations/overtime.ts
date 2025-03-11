import { z } from 'zod';

export const overtimeStatus = [
  'Approved',
  'Pending',
  'Canceled',
  'Rejected',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const userSchema = z.object({
  Avatar: z.string().optional(),
  contactNo: z.string().optional(),
  companyEmail: z.string().optional(),
  Designation: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  _id: z.string(),
});

const overtimeSchema = z.object({
  _id: z.string(),
  hrId: userSchema.optional(),
  userId: userSchema.optional(),
  reason: z.string(),
  overtimeMinutes: z.number(),
  date: z.string(),
  rejectionReason: z.string().optional(),
  status: z.enum(overtimeStatus),
  isDeleted: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

const overtimeApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(overtimeSchema),
});

const overtimeRequestApiResponseSchema = z.object({
  totalCount: z.number(),
  data: z.array(overtimeSchema),
});

const requestChartSchema = z.object({
  totalCount: z.number(),
  approvedCount: z.number(),
  canceledCount: z.number(),
  rejectedCount: z.number(),
  pendingCount: z.number(),
});

const monthsChartSchema = z.object({
  month: z.string(),
  year: z.number(),
  approvedMinutes: z.number(),
  rejectedMinutes: z.number(),
});

const overtimeChartApiResponseSchema = z.object({
  chartData1: z.array(monthsChartSchema),
  chartData2: requestChartSchema,
});

export type MonthsSummary = z.infer<typeof monthsChartSchema>;
export type RequestChart = z.infer<typeof requestChartSchema>;
export type OvertimeChartApiResponse = z.infer<
  typeof overtimeChartApiResponseSchema
>;
export type OvertimeListApiResponse = z.infer<typeof overtimeApiResponseSchema>;
export type OvertimeRequestListApiResponse = z.infer<
  typeof overtimeRequestApiResponseSchema
>;
export type OvertimeListType = z.infer<typeof overtimeSchema>;
export type OvertimeListArrayType = z.infer<typeof overtimeSchema>[] | [];

export {
  overtimeApiResponseSchema,
  overtimeSchema,
  paginationSchema,
  userSchema,
  overtimeRequestApiResponseSchema,
  overtimeChartApiResponseSchema,
};
