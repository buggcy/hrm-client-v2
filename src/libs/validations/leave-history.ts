import { z } from 'zod';

import { approvedIdSchema, userIdSchema } from './hr-leave-list';

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
  __v: z.number(),
  User_ID: userIdSchema,
  ApprovedBy_ID: approvedIdSchema.optional(),
  Status: z.enum(leave_history_status),
  Leave_Type: z.string().optional(),
  Start_Date: z.string(),
  End_Date: z.string().optional(),
  Title: z.string(),
  Description: z.string().optional(),
  Proof_Document: z.string().optional(),
  isDeleted: z.boolean(),
  Tahometer_ID: z.string().optional(),
  rejectedReason: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
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
  _id: z.string(),
});

const AnnualLeaveRecordSchema = z.object({
  year: z.number(),
  annualLeaves: z.number(),
  _id: z.string(),
});

const ExtraLeaveSchema = z.object({
  userId: z.string().optional(),
  title: z.string(),
  leavesAllowed: z.number(),
  leavesTaken: z.number(),
  month: z.number().optional(),
  year: z.number().optional(),
  _id: z.string(),
});

const EmployeeLeavesDataApiResponseSchema = z.object({
  _id: z.string(),
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
  __v: z.number(),
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
export type AllowedLeaveApiResponse = z.infer<
  typeof EmployeeLeavesDataApiResponseSchema
>;
export {
  leaveHistoryApiResponseSchema,
  leaveHistoryListSchema,
  paginationSchema,
  applyLeaveApiResponseSchema,
  EmployeeLeavesDataApiResponseSchema,
  leaveApiResponseSchema,
  ExtraLeaveSchema,
};
