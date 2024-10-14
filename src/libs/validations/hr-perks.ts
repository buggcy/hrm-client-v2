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
  incrementAmount: z.number(),
  dateApplied: z.string(),
  hrApproval: z.string(),
  decisionDate: z.string(),
  document: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

const HrEmployeeAllPerksApiResponseSchema = z.object({
  data: z.array(HrEmployeeAllPerksSchema),
});

export type HrPerksListType = z.infer<typeof hrPerksListSchema>;

export {
  hrPerksListApiResponseSchema,
  HrPerksGetEmployeesApiResponseSchema,
  HrEmployeeAllPerksApiResponseSchema,
};
