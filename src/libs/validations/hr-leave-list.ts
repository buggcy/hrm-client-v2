import { z } from 'zod';

export const LeaveStatus = [
  'Approved',
  'Rejected',
  'Pending',
  'Canceled',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const userIdSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  companyEmail: z.string().optional(),
  Avatar: z.string().optional(),
  Designation: z.string().optional(),
  contactNo: z.string().optional(),
});

const approvedIdSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  Avatar: z.string().optional(),
});

const leaveListSchema = z.object({
  _id: z.string(),
  __v: z.number(),
  User_ID: userIdSchema,
  ApprovedBy_ID: approvedIdSchema.optional(),
  Status: z.enum(LeaveStatus).optional(),
  Leave_Type: z.string().optional(),
  Start_Date: z.string().optional(),
  End_Date: z.string().optional(),
  Title: z.string().optional(),
  Description: z.string().optional(),
  Proof_Document: z.string().optional(),
  isDeleted: z.boolean(),
  Tahometer_ID: z.string().optional(),
  rejectedReason: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const leaveListRecordSchema = z.object({
  totalCount: z.number(),
  pendingCount: z.number(),
  approvedCount: z.number(),
  rejectedCount: z.number(),
  canceledCount: z.number(),
});

const leaveListApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(leaveListSchema),
});

const leaveTrendChartSchema = z.object({
  month: z.string(),
  approved: z.number(),
  rejected: z.number(),
  cancelled: z.number(),
});

const leaveTrendChartApiResponseSchema = z.object({
  data: z.array(leaveTrendChartSchema),
});

export type LeaveListApiResponse = z.infer<typeof leaveListApiResponseSchema>;
export type LeaveListType = z.infer<typeof leaveListSchema>;
export type LeaveListArrayType = z.infer<typeof leaveListSchema>[] | [];
export type LeaveListRecordApiResponse = z.infer<typeof leaveListRecordSchema>;
export type LeaveTrendChartType = z.infer<typeof leaveTrendChartSchema>;
export type LeaveTrendChartApiResponse = z.infer<
  typeof leaveTrendChartApiResponseSchema
>;

export {
  leaveListApiResponseSchema,
  userIdSchema,
  paginationSchema,
  approvedIdSchema,
  leaveListRecordSchema,
  leaveTrendChartSchema,
  leaveTrendChartApiResponseSchema,
};
