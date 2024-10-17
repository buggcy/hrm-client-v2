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

const designationSchema = z.object({
  _id: z.string(),
  isDeleted: z.boolean(),
  status: z.string(),
  designationType: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  userId: userIdSchema,
  type: z.literal('designation').optional(),
});

const designationApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(designationSchema),
});

export type DesignationApiResponse = z.infer<
  typeof designationApiResponseSchema
>;
export type Designation = z.infer<typeof designationSchema>;

export type DesignationQueryParamsType = {
  page: number;
  limit: number;
  status: string;
};

export {
  designationApiResponseSchema,
  designationSchema,
  paginationSchema,
  userIdSchema,
};
