import { z } from 'zod';

export const attendance_history_status = [
  'Present',
  'Absent',
  'Leave',
  'Holiday',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const attendanceHistoryListSchema = z.object({
  _id: z.string(),
  date: z.string(),
  Total_Time: z.string(),
  Start_Date: z.string(),
  End_Date: z.string(),
  Productivity: z.string(),
  Status: z.enum(attendance_history_status),
});

const attendanceHistoryApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(attendanceHistoryListSchema),
});

export type AttendanceHistoryApiResponse = z.infer<
  typeof attendanceHistoryApiResponseSchema
>;
export type AttendanceHistoryListType = z.infer<
  typeof attendanceHistoryListSchema
>;

export {
  attendanceHistoryApiResponseSchema,
  attendanceHistoryListSchema,
  paginationSchema,
};
