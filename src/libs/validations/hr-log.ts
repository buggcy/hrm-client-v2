import { z } from 'zod';

export const LogStatus = ['Success', 'Error', 'Failed'] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const messageSchema = z.object({
  _id: z.string(),
  status: z.enum(LogStatus),
  timestamp: z.string(),
  message: z.string(),
  errorMessage: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
});

const LogListSchema = z.object({
  _id: z.string(),
  __v: z.number(),
  overallStatus: z.enum(LogStatus),
  message: z.array(messageSchema),
  title: z.string(),
  type: z.string(),
  createdAt: z.string(),
});

const logApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(LogListSchema),
});

export type LogListApiResponse = z.infer<typeof logApiResponseSchema>;
export type LogListType = z.infer<typeof LogListSchema>;
export type LogListArrayType = z.infer<typeof LogListSchema>[] | [];

export { paginationSchema, logApiResponseSchema, LogListSchema, messageSchema };
