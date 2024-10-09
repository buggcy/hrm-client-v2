import { z } from 'zod';

export const priorityOptions = ['Low', 'Medium', 'High'] as const;
export const targetAudienceOptions = [
  'All',
  'HR',
  'Employees',
  'Management',
] as const;

export const announcementSchema = z.object({
  hrId: z.string().nonempty('HR ID is required'),
  title: z.string().min(1, 'Title is required'),
  StartDate: z.date(),
  EndDate: z.date(),
  Priority: z.enum(priorityOptions),
  TargetAudience: z.enum(targetAudienceOptions),
  Description: z.string().min(1, 'Description is required'),
  File: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const announcementApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(announcementSchema),
});

export type AnnouncementType = z.infer<typeof announcementSchema>;
export type PaginationType = z.infer<typeof paginationSchema>;
export type AnnouncementApiResponse = z.infer<
  typeof announcementApiResponseSchema
>;
