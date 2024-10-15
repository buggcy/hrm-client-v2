import { z } from 'zod';

import { ExtraLeaveSchema } from './leave-history';

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const employeePerksSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  Avatar: z.string().optional(),
});

const extraLeaveApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(ExtraLeaveSchema),
});

export type ExtraLeaveApiResponse = z.infer<typeof extraLeaveApiResponseSchema>;
export type ExtraLeaveType = z.infer<typeof ExtraLeaveSchema>;
export type ExtraLeaveArrayType = z.infer<typeof ExtraLeaveSchema>[] | [];

export type EmployeePerksType = z.infer<typeof employeePerksSchema>;
export type EmployeePerksArrayType = z.infer<typeof employeePerksSchema>[] | [];
export { paginationSchema, employeePerksSchema, extraLeaveApiResponseSchema };
