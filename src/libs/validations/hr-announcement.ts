import { z } from 'zod';

export const priorityOptions = ['Low', 'Medium', 'High'] as const;
export const targetAudienceOptions = [
  'All',
  'HR',
  'Employees',
  'Management',
] as const;

export const announcementSchema = z.object({
  _id: z.string(),
  hrId: z.string(),
  title: z.string(),
  StartDate: z.string(),
  EndDate: z.string(),
  Priority: z.string(),
  TargetAudience: z.string(),
  Description: z.string(),
  File: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
  type: z.literal('hrAnnouncement').optional(),
});

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

export const announcementApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(announcementSchema),
});

export type PolicyQueryParamsType = {
  page?: number;
  limit?: number;
  title?: string;
  isEnabled?: string[];
  TargetAudience?: string;
  Description?: string;
  Priority?: string[];
  StartDate?: string;
  EndDate?: string;
};

export type AnnouncementType = z.infer<typeof announcementSchema>;
export type AnnouncementListType =
  | z.infer<typeof announcementSchema>[]
  | undefined;

export type PaginationType = z.infer<typeof paginationSchema>;
export type AnnouncementApiResponse = z.infer<
  typeof announcementApiResponseSchema
>;
