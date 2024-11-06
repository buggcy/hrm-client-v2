import { z } from 'zod';

const AttendanceDataEntrySchema = z.object({
  date: z.string(),
  present: z.number().nonnegative(),
  absent: z.number().nonnegative(),
  leave: z.number().nonnegative(),
  late: z.number().nonnegative(),
});
export type HrStatsAttendanceDataEntry = z.infer<
  typeof AttendanceDataEntrySchema
>;

const employeeCountSchema = z.object({
  intern: z.number().nonnegative(),
  probational: z.number().nonnegative(),
  fullTime: z.number().nonnegative(),
});
export type HrStatsEmployeeCount = z.infer<typeof employeeCountSchema>;

const pendingRequestsSchema = z.object({
  employee: z.number().nonnegative(),
  leave: z.number().nonnegative(),
  perk: z.number().nonnegative(),
  resignation: z.number().nonnegative(),
});
export type HrStatsPendingRequests = z.infer<typeof pendingRequestsSchema>;

const payrollCountSchema = z.object({
  paid: z.number().nonnegative(),
  unpaid: z.number().nonnegative(),
});
export type HrStatsPayrollCount = z.infer<typeof payrollCountSchema>;

const attendanceDataSchema = z.array(AttendanceDataEntrySchema);
export type HrStatsAttendanceData = z.infer<typeof attendanceDataSchema>;

const productivityDataSchema = z.object({
  Monday: z.union([z.number().nonnegative(), z.string()]),
  Tuesday: z.union([z.number().nonnegative(), z.string()]),
  Wednesday: z.union([z.number().nonnegative(), z.string()]),
  Thursday: z.union([z.number().nonnegative(), z.string()]),
  Friday: z.union([z.number().nonnegative(), z.string()]),
});

const perkDataSchema = z.object({
  month: z.string(),
  approved: z.number(),
  rejected: z.number(),
  approvedAmount: z.number(),
  rejectedAmount: z.number(),
});

export type HrStatsPerkDistributionData = z.infer<typeof perkDataSchema>;

export type HrStatsProductivityData = z.infer<typeof productivityDataSchema>;

const hrDashboardStatsApiResponseSchema = z.object({
  employeeCount: employeeCountSchema,
  pendingRequests: pendingRequestsSchema,
  payrollCount: payrollCountSchema,
  attendanceData: attendanceDataSchema,
  productivityData: productivityDataSchema,
  perkData: z.array(perkDataSchema),
});

export type HrDashboardStatsApiResponse = z.infer<
  typeof hrDashboardStatsApiResponseSchema
>;
export { hrDashboardStatsApiResponseSchema };
