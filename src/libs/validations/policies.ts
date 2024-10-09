import { z } from 'zod';

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const userIdSchema = z.object({
  Avatar: z.string().optional(),
  companyEmail: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  _id: z.string(),
});

const policyListSchema = z.object({
  _id: z.string(),
  category: z.string(),
  createdAt: z.string(),
  file: z.string(),
  isDeleted: z.boolean(),
  updatedAt: z.string(),
  userId: userIdSchema,
  type: z.literal('employeepolicy').optional(),
});

const policyApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(policyListSchema),
});

export type PolicyApiResponse = z.infer<typeof policyApiResponseSchema>;
export type PolicyListType = z.infer<typeof policyListSchema>;

export {
  policyApiResponseSchema,
  policyListSchema,
  paginationSchema,
  userIdSchema,
};
