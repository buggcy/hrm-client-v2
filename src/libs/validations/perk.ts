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
  totalIncrementAmount: z.number(),
  totalDecrementAmount: z.number(),
});

const averageSchema = z.object({
  averageIncrementAmount: z.number(),
  averageDecrementAmount: z.number(),
});

const perksIdSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  salaryIncrement: z.boolean(),
  salaryDecrement: z.boolean(),
  __v: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const availablePerkSchema = z.object({
  _id: z.string(),
  perksId: perksIdSchema,
  hrApproval: z.enum(hrApproval).optional(),
  assignedIncrementAmount: z.number(),
  incrementAmount: z.number(),
  isAvailed: z.boolean(),
  assignedDecrementAmount: z.number(),
  decrementAmount: z.number(),
});

const employeePerkApplicationSchema = z.object({
  appliedAmount: z.number(),
  hrApproval: z.string(),
  decisionDate: z.string().optional().nullable(),
  dateApplied: z.string(),
  Proof_Document: z.string().optional(),
  _id: z.string(),
});

const transformedPerkDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  incrementAmount: employeePerkApplicationSchema.shape.appliedAmount,
  dateApplied: employeePerkApplicationSchema.shape.dateApplied,
  decisionDate: employeePerkApplicationSchema.shape.decisionDate,
  hrApproval: employeePerkApplicationSchema.shape.hrApproval,
  userId: z.string(),
  requestId: employeePerkApplicationSchema.shape._id,
  assignedIncrementAmount: z.number(),
  description: z.string(),
});

export type TransformedPerkData = z.infer<typeof transformedPerkDataSchema>;

const perkListSchema = z.object({
  id: z.string(),
  name: z.string(),
  incrementAmount: employeePerkApplicationSchema.shape.appliedAmount,
  dateApplied: employeePerkApplicationSchema.shape.dateApplied,
  decisionDate: employeePerkApplicationSchema.shape.decisionDate,
  hrApproval: employeePerkApplicationSchema.shape.hrApproval,
  userId: z.string(),
  requestId: employeePerkApplicationSchema.shape._id,
  assignedIncrementAmount: z.number(),
  description: z.string(),
});

const perkApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(perkListSchema),
});

const perkRecordApiResponseSchema = z.object({
  records: recordSchema,
  averages: averageSchema,
  availableData: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      assignedIncrementAmount: z.number(),
      incrementAmount: z.number(),
      differenceIncrementAmount: z.number(),
    }),
  ),
  approvedData: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      assignedIncrementAmount: z.number(),
      incrementAmount: z.number(),
      assignedDecrementAmount: z.number(),
      decrementAmount: z.number(),
    }),
  ),
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
