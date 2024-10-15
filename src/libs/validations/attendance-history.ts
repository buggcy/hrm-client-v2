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

const card1DataSchema = z.object({
  status: z.string(),
  timeCompleted: z.number(),
  timeLeft: z.number(),
});

const card2DataSchema = z.object({
  averageHours: z.number(),
  averageCheckInTime: z.string(),
  averageCheckOutTime: z.string(),
  onTimeArrivals: z.number(),
});

const card3DataSchema = z.object({
  count: z.number(),
  leaves: z.number(),
  absents: z.number(),
  onTimeCheckIns: z.number(),
  lateCheckIns: z.number(),
});

const AttendanceStatsApiResponseSchema = z.object({
  card1Data: card1DataSchema,
  card2Data: card2DataSchema,
  card3Data: card3DataSchema,
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
  AttendanceStatsApiResponseSchema,
};
