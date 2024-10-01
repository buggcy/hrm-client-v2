import { z } from 'zod';

export const hrApproval = ['approved', 'rejected', 'pending'] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
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

export type PerkApiResponse = z.infer<typeof perkApiResponseSchema>;
export type PerkListType = z.infer<typeof perkListSchema>;

export { perkApiResponseSchema, perkListSchema, paginationSchema };
