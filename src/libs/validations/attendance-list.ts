import { z } from 'zod';

const card1DataSchema = z.object({
  totalPresent: z.number(),
  totalAbsent: z.number(),
  totalLeave: z.number(),
});

const dayTypeSchema = z.object({
  Present: z.number(),
  Absent: z.number(),
  Leave: z.number(),
  Holiday: z.number(),
});

const card2DataSchema = z.object({
  Monday: dayTypeSchema,
  Tuesday: dayTypeSchema,
  Wednesday: dayTypeSchema,
  Thursday: dayTypeSchema,
  Friday: dayTypeSchema,
  Saturday: dayTypeSchema,
  Sunday: dayTypeSchema,
});

const card3DataSchema = z.object({
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

const AttendanceListStatsApiResponseSchema = z.object({
  card1Data: card1DataSchema,
  card2Data: card2DataSchema,
  card3Data: card3DataSchema,
});

export const attendance_history_status = [
  'Present',
  'Absent',
  'Leave',
  'Holiday',
] as const;

const breakSchema = z.object({
  Start_Break: z.string(),
  End_Break: z.string(),
  _id: z.string(),
});

const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  companyEmail: z.string(),
  Avatar: z.string().optional(),
});

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const attendanceListSchema = z.object({
  _id: z.string(),
  User_ID: z.string(),
  Start_Date: z.string(),
  End_Date: z.string(),
  Total_Time: z.string(),
  Status: z.string(),
  isDeleted: z.boolean(),
  date: z.string(),
  breaks: z.array(breakSchema),
  Productivity: z.string(),
  user: userSchema,
});

const attendanceListApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(attendanceListSchema),
});

export type AttendanceApiResponse = z.infer<
  typeof attendanceListApiResponseSchema
>;
export type AttendanceListType = z.infer<typeof attendanceListSchema>;

export type AttendanceUser = z.infer<typeof userSchema>;

export type AttendanceBreaks = z.infer<typeof breakSchema>;

export {
  AttendanceListStatsApiResponseSchema,
  attendanceListApiResponseSchema,
  attendanceListSchema,
};
