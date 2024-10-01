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

export type LeaveHistoryApiResponse = z.infer<
  typeof leaveHistoryApiResponseSchema
>;
export type LeaveHistoryListType = z.infer<typeof leaveHistoryListSchema>;

export {
  leaveHistoryApiResponseSchema,
  leaveHistoryListSchema,
  paginationSchema,
};
