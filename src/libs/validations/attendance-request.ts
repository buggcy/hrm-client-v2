import { z } from 'zod';

const attendance_request_status = [
  'Pending',
  'Approved',
  'Rejected',
  'Cancelled',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const attendanceRequestSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  date: z.string(),
  Start_Date: z.string(),
  End_Date: z.string(),
  Total_Time: z.string(),
  reason: z.string().optional(),
  Status: z.enum(attendance_request_status),
  Document: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const attendanceRequestApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(attendanceRequestSchema),
});

const monthsSummarySchema = z.object({
  date: z.string(),
  approved: z.number(),
  pending: z.number(),
  rejected: z.number(),
  total: z.number(),
});

export type MonthsSummary = z.infer<typeof monthsSummarySchema>;

const summarySchema = z.object({
  approved: z.number(),
  pending: z.number(),
  rejected: z.number(),
});

export type Summary = z.infer<typeof summarySchema>;

const attendanceRequestStatsAPIResponseSchema = z.object({
  recentRequests: z.array(attendanceRequestSchema),
  monthsummary: z.array(monthsSummarySchema),
  summary: summarySchema,
});

export type AttendanceRequestStatsAPIResponse = z.infer<
  typeof attendanceRequestStatsAPIResponseSchema
>;

export type AttendanceRequest = z.infer<typeof attendanceRequestSchema>;
export type AttendanceRequestApiResponse = z.infer<
  typeof attendanceRequestApiResponseSchema
>;

export {
  attendanceRequestSchema,
  attendanceRequestApiResponseSchema,
  attendanceRequestStatsAPIResponseSchema,
};
