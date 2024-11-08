import { z } from 'zod';

export const complaintStatus = ['Resolved', 'Pending', 'Canceled'] as const;
const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});
const userSchema = z.object({
  Avatar: z.string().optional(),
  contactNo: z.string().optional(),
  companyEmail: z.string().optional(),
  DeleteResignation: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  _id: z.string(),
});

const complaintSchema = z.object({
  _id: z.string(),
  employee: userSchema.optional(),
  resolvedBy: userSchema.optional(),
  title: z.string(),
  complaint: z.string(),
  resolvedDate: z.string().optional(),
  complaintFeedback: z.string().optional(),
  status: z.enum(complaintStatus),
  document: z.string().optional(),
  isDeleted: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

const complaintRecordSchema = z.object({
  totalCount: z.number(),
  pendingCount: z.number(),
  resolvedCount: z.number(),
  canceledCount: z.number(),
});

const complaintTrendChartSchema = z.object({
  month: z.string(),
  resolved: z.number(),
  pending: z.number(),
  canceled: z.number(),
});

const complaintApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(complaintSchema),
});

const complaintTrendChartApiResponseSchema = z.object({
  records: complaintRecordSchema,
  data: z.array(complaintTrendChartSchema),
});

export type ComplaintListApiResponse = z.infer<
  typeof complaintApiResponseSchema
>;
export type ComplaintListType = z.infer<typeof complaintSchema>;
export type ComplaintListArrayType = z.infer<typeof complaintSchema>[] | [];
export type ComplaintTrendChartType = z.infer<typeof complaintTrendChartSchema>;
export type ComplaintTrendChartApiResponse = z.infer<
  typeof complaintTrendChartApiResponseSchema
>;
export {
  complaintRecordSchema,
  complaintApiResponseSchema,
  complaintTrendChartSchema,
  paginationSchema,
  complaintSchema,
  complaintTrendChartApiResponseSchema,
};
