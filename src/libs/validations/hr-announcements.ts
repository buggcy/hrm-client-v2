import { z } from 'zod';

const announcementListSchema = z.object({
  _id: z.string(),
  hrId: z.string(),
  title: z.string(),
  StartDate: z.string(),
  EndDate: z.string(),
  Priority: z.enum(['High', 'Medium', 'Low']),
  TargetAudience: z.string(),
  Description: z.string(),
  isDeleted: z.boolean(),
  isEnabled: z.boolean(),
});

const priorityStatsSchema = z.object({
  high: z.number(),
  medium: z.number(),
  low: z.number(),
});

const monthYearSchema = z.string().regex(/^[A-Za-z]{3,4} \d{2}$/);

const statsSummaryItemSchema = z.object({
  month: monthYearSchema,
  high: z.number(),
  medium: z.number(),
  low: z.number(),
});

const statsSummarySchema = z.array(statsSummaryItemSchema);

const ManageAnnouncementsStatsApiResponseSchema = z.object({
  priorityStats: priorityStatsSchema,
  statsSummary: statsSummarySchema,
  latestAnnouncements: z.array(announcementListSchema),
});

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const ManageAnnouncementsApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(announcementListSchema),
});

export type ManageAnnouncementsStatsApiResponse = z.infer<
  typeof ManageAnnouncementsStatsApiResponseSchema
>;
export type priorityStats = z.infer<typeof priorityStatsSchema>;
export type statsSummary = z.infer<typeof statsSummarySchema>;
export type AnnouncementType = z.infer<typeof announcementListSchema>;
export type ManageAnnouncementsApiResponse = z.infer<
  typeof ManageAnnouncementsApiResponseSchema
>;

export {
  ManageAnnouncementsStatsApiResponseSchema,
  ManageAnnouncementsApiResponseSchema,
};
