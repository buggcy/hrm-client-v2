import { z } from 'zod';

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
  card2Data: card2DataSchema,
  card3Data: card3DataSchema,
});

const AttendanceDistributionStatsApiResponseSchema = z.object({
  totalPresent: z.number(),
  totalAbsent: z.number(),
  totalLeave: z.number(),
});

export const attendance_history_status = [
  'Present',
  'Absent',
  'Leave',
  'Holiday',
  'Unpaid Leave',
] as const;

const breakSchema = z.object({
  Start_Break: z.string(),
  End_Break: z.string(),
  _id: z.string(),
});

const userSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyEmail: z.string().optional(),
  Avatar: z.string().optional().nullable(),
  Tahometer_ID: z.string().optional(),
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
  End_Date: z.string().nullable(),
  Total_Time: z.string(),
  Status: z.enum(attendance_history_status),
  isDeleted: z.boolean(),
  date: z.string(),
  breaks: z.array(breakSchema),
  Productivity: z.string(),
  user: userSchema.optional(),
  Remaining_Minutes: z.string().optional(),
  Late_Minutes: z.number().optional(),
  createdAt: z.string().optional(),
  __v: z.number().optional(),
});

const attendanceListApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(attendanceListSchema),
});

export const gender = ['male', 'female'] as const;
export const approvalStatus = ['Approved', 'Pending', 'Rejected'] as const;
export const maritalStatus = ['married', 'unmarried'] as const;
export const bloodgroupStatus = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
] as const;

const employeeListSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  Tahometer_ID: z.string().optional(),
  Avatar: z.string().optional(),
  companyEmail: z.string().optional(),
});

const attendanceUsersApiResponseSchema = z.object({
  users: z.array(employeeListSchema),
});

export type AttendanceUseApiResponse = z.infer<
  typeof attendanceUsersApiResponseSchema
>;

const userDateAttendanceSchema = z.object({
  Start_Date: z.string().optional(),
  End_Date: z.string().optional().nullable(),
  Total_Time: z.string().optional(),
  Status: z.string().optional(),
  message: z.string().optional(),
});

export type AttendanceApiResponse = z.infer<
  typeof attendanceListApiResponseSchema
>;
export type AttendanceListType = z.infer<typeof attendanceListSchema>;

export type AttendanceUser = z.infer<typeof userSchema>;

export type AttendanceBreaks = z.infer<typeof breakSchema>;

const attendanceRequestSchema = z.object({
  _id: z.string(),
  userId: employeeListSchema.extend({
    contactNo: z.string().optional(),
    Designation: z.string().optional(),
  }),
  date: z.string(),
  Start_Date: z.string(),
  End_Date: z.string(),
  Total_Time: z.string(),
  reason: z.string(),
  Document: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const attendanceRequestAPIResponseSchema = z.object({
  requests: z.array(attendanceRequestSchema),
});

export type AttendanceRequestType = z.infer<typeof attendanceRequestSchema>;

export type AttendanceRequestApiResponse = z.infer<
  typeof attendanceRequestAPIResponseSchema
>;

export {
  AttendanceListStatsApiResponseSchema,
  attendanceListApiResponseSchema,
  attendanceListSchema,
  attendanceUsersApiResponseSchema,
  userDateAttendanceSchema,
  AttendanceDistributionStatsApiResponseSchema,
  attendanceRequestAPIResponseSchema,
};
