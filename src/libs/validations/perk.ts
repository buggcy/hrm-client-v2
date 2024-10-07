import { z } from 'zod';

export const hrApproval = [
  'approved',
  'rejected',
  'pending',
  'available',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const recordSchema = z.object({
  totalRecords: z.number(),
  totalAvailablePerks: z.number(),
  totalPendingPerks: z.number(),
  totalRejectedPerks: z.number(),
  totalApprovedPerks: z.number(),
});

const averageSchema = z.object({
  averageIncrementAmount: z.number(),
  averageDecrementAmount: z.number(),
});

const perksIdSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

const availablePerkSchema = z.object({
  _id: z.string(),
  perksId: perksIdSchema,
  hrApproval: z.enum(hrApproval).optional(),
  assignedIncrementAmount: z.number(),
  incrementAmount: z.number(),
  isAvailed: z.boolean(),
});

const perkListSchema = z.object({
  _id: z.string(),
  description: z.string(),
  name: z.string(),
  document: z.string(),
  decrementAmount: z.number(),
  assignedDecrementAmount: z.number(),
  assignedIncrementAmount: z.number(),
  incrementAmount: z.number(),
  __v: z.number(),
  hrApproval: z.enum(hrApproval).optional(),
  isAvailable: z.boolean(),
  isAvailed: z.boolean(),
  salaryDecrement: z.boolean(),
  salaryIncrement: z.boolean(),
  dateApplied: z.string().optional(),
  decisionDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const perkApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(perkListSchema),
});

const perkRecordApiResponseSchema = z.object({
  records: recordSchema,
  averages: averageSchema,
  availableData: z.array(availablePerkSchema),
});

export type PerkApiResponse = z.infer<typeof perkApiResponseSchema>;
export type PerkListType = z.infer<typeof perkListSchema>;
export type PerkListArrayType = z.infer<typeof perkListSchema>[] | [];

export type PerkRecordApiResponse = z.infer<typeof perkRecordApiResponseSchema>;
export type PerkAvailableType = z.infer<typeof availablePerkSchema>;
export type PerkAvailableArrayType = z.infer<typeof availablePerkSchema>[] | [];

export {
  perkApiResponseSchema,
  perkListSchema,
  paginationSchema,
  recordSchema,
  averageSchema,
  perkRecordApiResponseSchema,
  availablePerkSchema,
};
