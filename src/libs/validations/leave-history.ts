import { z } from 'zod';

export const leave_history_status = [
  'Approved',
  'Pending',
  'Rejected',
  'Canceled',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const leaveHistoryListSchema = z.object({
  _id: z.string(),
  Title: z.string(),
  Leave_Type: z.string(),
  Start_Date: z.string(),
  End_Date: z.string(),
  Status: z.enum(leave_history_status),
});

const leaveHistoryApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(leaveHistoryListSchema),
});

const applyLeaveApiResponseSchema = z.object({
  message: z.string(),
});

const MonthlyLeaveRecordSchema = z.object({
  year: z.number(),
  month: z.number(),
  casualLeaves: z.number(),
  sickLeaves: z.number(),
});

const AnnualLeaveRecordSchema = z.object({
  year: z.number(),
  annualLeaves: z.number(),
});

const ExtraLeaveSchema = z.object({
  title: z.string(),
  leavesAllowed: z.number(),
  leavesTaken: z.number(),
  month: z.number().optional(),
  year: z.number().optional(),
});

const EmployeeLeavesDataApiResponseSchema = z.object({
  userId: z.string(),
  allowedCasualLeaves: z.number(),
  allowedSickLeaves: z.number(),
  monthlyLeavesAllowed: z.number(),
  monthlyLeaveRecords: z.array(MonthlyLeaveRecordSchema),
  annualLeavesAllowed: z.number(),
  annualLeavesRecords: z.array(AnnualLeaveRecordSchema),
  extraLeaves: z.array(ExtraLeaveSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const dayOfWeekCountSchema = z.object({
  Monday: z.number(),
  Tuesday: z.number(),
  Wednesday: z.number(),
  Thursday: z.number(),
  Friday: z.number(),
  Saturday: z.number(),
  Sunday: z.number(),
});

const monthCountSchema = z.object({
  January: z.number(),
  February: z.number(),
  March: z.number(),
  April: z.number(),
  May: z.number(),
  June: z.number(),
  July: z.number(),
  August: z.number(),
  September: z.number(),
  October: z.number(),
  November: z.number(),
  December: z.number(),
});

export interface leaves {
  totalTakenLeaves: number;
  totalAllowedLeaves: number;
  monthlyAllowedLeaved: number;
  annualAllowedLeaves: number;
  totalCasualLeaves: number;
  totalSickLeaves: number;
  totalAnnualLeaveCount: number;
}

const leavesSchema = z.object({
  totalTakenLeaves: z.number(),
  totalAllowedLeaves: z.number(),
  monthlyAllowedLeaved: z.number(),
  annualAllowedLeaves: z.number(),
  totalCasualLeaves: z.number(),
  totalSickLeaves: z.number(),
  totalAnnualLeaveCount: z.number(),
});

const leaveApiResponseSchema = z.object({
  dayOfWeekCount: dayOfWeekCountSchema,
  monthCount: monthCountSchema,
  leaves: leavesSchema,
});

export type LeaveHistoryApiResponse = z.infer<
  typeof leaveHistoryApiResponseSchema
>;
export type LeaveHistoryListType = z.infer<typeof leaveHistoryListSchema>;

export {
  leaveHistoryApiResponseSchema,
  leaveHistoryListSchema,
  paginationSchema,
  applyLeaveApiResponseSchema,
  EmployeeLeavesDataApiResponseSchema,
  leaveApiResponseSchema,
};
