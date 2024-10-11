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
  End_Date: z.string(),
  Total_Time: z.string(),
  Status: z.string(),
  isDeleted: z.boolean(),
  date: z.string(),
  breaks: z.array(breakSchema),
  Productivity: z.string(),
  user: userSchema,
  Late_Minutes: z.number().optional(),
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

const addressSchema = z
  .object({
    city: z.string().optional(),
    street: z.string().optional(),
    province: z.string().optional(),
    landMark: z.string().optional(),
    country: z.string().optional(),
    zip: z.string().optional(),
    full: z.string().optional(),
    _id: z.string(),
  })
  .optional();

const positionSchema = z.object({
  position: z.string(),
  isCurrent: z.boolean(),
  _id: z.string(),
  timestamp: z.string(),
});

const employeeListSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  contactNo: z.string(),
  uniqueCode: z.string().optional(),
  roleId: z.number(),
  companyEmail: z.string().email(),
  Ed_Exp_ID: z.array(z.string()).optional(),
  dep_ID: z.array(z.string()).optional(),
  isDeleted: z.boolean().optional(),
  UniqueCodeExpire: z.string().optional(),
  Blood_Group: z.string().optional(),
  DOB: z.string().optional(),
  Emergency_Phone: z.string().optional(),
  Family_Name: z.string().optional(),
  Family_Occupation: z.string().optional(),
  Family_PhoneNo: z.string().optional(),
  Family_Relation: z.string().optional(),
  Gender: z.enum(gender).optional(),
  Marital_Status: z.enum(maritalStatus).optional(),
  Nationality: z.string().optional(),
  isApproved: z.enum(approvalStatus),
  password: z.string().optional(),
  rejectedReason: z.string().optional(),
  Avatar: z.string().nullable().optional(),
  Current_Status: z.string().optional(),
  profileDescription: z.string().optional(),
  Tahometer_ID: z.string().optional(),
  basicSalary: z.number(),
  activeStatus: z.boolean().optional(),
  updatedAt: z.string(),
  position: z.array(positionSchema).optional(),
  Joining_Date: z.string().nullable().optional(),
  otp: z.string().optional(),
  otpExpires: z.string().optional(),
  Address: addressSchema,
  Designation: z.string().optional(),
  createdAt: z.string().optional(),
  __v: z.number().optional(),
  type: z.literal('employee').optional(),
});

const attendanceUsersApiResponseSchema = z.object({
  users: z.array(employeeListSchema),
});

const userDateAttendanceSchema = z.object({
  Start_Date: z.string().optional(),
  End_Date: z.string().optional(),
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

export {
  AttendanceListStatsApiResponseSchema,
  attendanceListApiResponseSchema,
  attendanceListSchema,
  attendanceUsersApiResponseSchema,
  userDateAttendanceSchema,
  AttendanceDistributionStatsApiResponseSchema,
};
