import { z } from 'zod';

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

export type EmployeePerksType = z.infer<typeof employeePerksSchema>;
export type EmployeePerksArrayType = z.infer<typeof employeePerksSchema>[] | [];
export { paginationSchema, employeePerksSchema };
