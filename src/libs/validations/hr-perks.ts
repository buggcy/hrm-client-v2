import { z } from 'zod';

const hrPerksListSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  salaryIncrement: z.boolean(),
  salaryDecrement: z.boolean(),
});

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const hrPerksListApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(hrPerksListSchema),
});

const HrPerksGetEmployeesSchema = z.object({
  id: z.string(),
  avatar: z.string().optional(),
  name: z.string(),
  email: z.string(),
});

const HrPerksGetEmployeesApiResponseSchema = z.object({
  data: z.array(HrPerksGetEmployeesSchema),
});

const hrEmployeePerkApplicationSchema = z.object({
  appliedAmount: z.number(),
  hrApproval: z.string(),
  decisionDate: z.string().optional().nullable(),
  dateApplied: z.string(),
  Proof_Document: z.string().optional().nullable(),
  _id: z.string(),
});

const HrEmployeeAllPerksSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  isAvailable: z.boolean(),
  isAvailed: z.boolean(),
  salaryDecrement: z.boolean(),
  salaryIncrement: z.boolean(),
  assignedDecrementAmount: z.number(),
  assignedIncrementAmount: z.number(),
  decrementAmount: z.number(),
  incrementApplications: z.array(hrEmployeePerkApplicationSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

const HrEmployeeAllPerksApiResponseSchema = z.object({
  data: z.array(HrEmployeeAllPerksSchema),
});

export type HrEmployeeAllPerksApiResponse = z.infer<
  typeof HrEmployeeAllPerksApiResponseSchema
>;

const HrPerkRequestsSchema = z.object({
  _id: z.string(),
  Proof_Document: z.string(),
  assignedIncrementAmount: z.number(),
  incrementAmount: z.number(),
  dateApplied: z.string(),
  userId: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    Avatar: z.string().optional(),
    companyEmail: z.string().email(),
    contactNo: z.string(),
  }),
  perksId: z.object({
    _id: z.string(),
    name: z.string(),
  }),
});

const HrPerkRequestsApiResponseSchema = z.object({
  data: z.array(HrPerkRequestsSchema),
});

const hrRecordSchema = z.object({
  totalPerks: z.number(),
  totalApprovedPerks: z.number(),
  totalRejectedPerks: z.number(),
  totalPerkAssigned: z.number(),
});

const hrTopAvailedPerkSchema = z.object({
  name: z.string(),
  count: z.number(),
});

const hrPerkChartDataSchema = z.object({
  month: z.string(),
  assigned: z.number(),
  availed: z.number(),
});

const hrPerkRecordApiResponseSchema = z.object({
  records: hrRecordSchema,
  topAvailed: z.array(hrTopAvailedPerkSchema),
  chartData: z.array(hrPerkChartDataSchema),
});

export type HrPerksListType = z.infer<typeof hrPerksListSchema>;

export type HrPerkRecordApiResponse = z.infer<
  typeof hrPerkRecordApiResponseSchema
>;
export type HrTopAvailedPerkType = z.infer<typeof hrTopAvailedPerkSchema>;
export type hrTopAvailedPerkArrayType =
  | z.infer<typeof hrTopAvailedPerkSchema>[]
  | [];

export type HrPerkChartDataType = z.infer<typeof hrPerkChartDataSchema>;
export type hrPerkChartDataArrayType =
  | z.infer<typeof hrPerkChartDataSchema>[]
  | [];

const employeePerkApplicationSchema = z.object({
  appliedAmount: z.number(),
  hrApproval: z.string(),
  decisionDate: z.string().optional().nullable(),
  dateApplied: z.string(),
  Proof_Document: z.string().optional(),
  _id: z.string(),
});

const hrperkListSchema = z.object({
  id: z.string(),
  name: z.string(),
  incrementAmount: employeePerkApplicationSchema.shape.appliedAmount,
  dateApplied: employeePerkApplicationSchema.shape.dateApplied,
  decisionDate: employeePerkApplicationSchema.shape.decisionDate,
  hrApproval: employeePerkApplicationSchema.shape.hrApproval,
  userId: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    Avatar: z.string().optional(),
    companyEmail: z.string().email(),
  }),
  requestId: employeePerkApplicationSchema.shape._id,
  description: z.string(),
  Proof_Document: z.string().optional(),
});

export type HrPerkRequestListType = z.infer<typeof hrperkListSchema>;

const hrperklistApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(hrperkListSchema),
});

export type HrPerkListApiResponse = z.infer<typeof hrperklistApiResponseSchema>;

export {
  hrPerksListApiResponseSchema,
  HrPerksGetEmployeesApiResponseSchema,
  HrEmployeeAllPerksApiResponseSchema,
  HrPerkRequestsApiResponseSchema,
  hrPerkChartDataSchema,
  hrTopAvailedPerkSchema,
  hrPerkRecordApiResponseSchema,
  hrperklistApiResponseSchema,
  hrperkListSchema,
};
