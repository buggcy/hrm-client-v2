import { z } from 'zod';

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const userIdSchema = z.object({
  _id: z.string(),
  Avatar: z.string().optional(),
  companyEmail: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

const policySchema = z.object({
  _id: z.string(),
  category: z.string(),
  createdAt: z.string(),
  file: z.string(),
  isDeleted: z.boolean(),
  updatedAt: z.string(),
  userId: userIdSchema,
  type: z.literal('hrPolicy').optional(),
});

const policyApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(policySchema),
});

export type PolicyApiResponse = z.infer<typeof policyApiResponseSchema>;
export type PolicyType = z.infer<typeof policySchema>;
export type PolicyInputType = Omit<
  PolicyType,
  '_id' | 'createdAt' | 'updatedAt' | 'isDeleted'
>;
export type PolicyQueryParamsType = {
  page: number;
  limit: number;
  category?: string;
};

export {
  policyApiResponseSchema,
  policySchema,
  paginationSchema,
  userIdSchema,
};
