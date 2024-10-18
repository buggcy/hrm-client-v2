import { z } from 'zod';

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});
const messageSchema = z.object({
  message: z.string(),
  timestamp: z.string(),
  status: z.string(),
});

const logsListSchema = z.object({
  createdAt: z.string(),
  overallStatus: z.string(),
  title: z.string(),
  type: z.string(),
  _id: z.string(),
  message: z.array(messageSchema),
});

const logsApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(logsListSchema),
});

export type LogsApiResponse = z.infer<typeof logsApiResponseSchema>;
export type LogsListType = z.infer<typeof logsListSchema>;
export type LogsListArrayType = z.infer<typeof logsListSchema>[] | [];
export type Messages = z.infer<typeof messageSchema>;

export { logsApiResponseSchema, logsListSchema, paginationSchema };
