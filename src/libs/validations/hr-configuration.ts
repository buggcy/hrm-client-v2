import { z } from 'zod';

export const ConfigurationType = [
  'designation',
  'education',
  'experience',
  'feedback',
  'timecutoff',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const userIdSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  companyEmail: z.string(),
  Avatar: z.string().optional(),
});

const configurationSchema = z.object({
  _id: z.string(),
  __v: z.number(),
  userId: userIdSchema,
  status: z.enum(ConfigurationType),
  experienceType: z.string().optional(),
  educationType: z.string().optional(),
  designationType: z.string().optional(),
  feedbackType: z.string().optional(),
  timeCutOff: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isDeleted: z.boolean(),
  isIntern: z.boolean().optional(),
  isProbational: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const configurationApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(configurationSchema),
});

export type ConfigurationApiResponse = z.infer<
  typeof configurationApiResponseSchema
>;
export type ConfigurationType = z.infer<typeof configurationSchema>;
export type ConfigurationArrayType = z.infer<typeof configurationSchema>[] | [];

export {
  configurationSchema,
  userIdSchema,
  paginationSchema,
  configurationApiResponseSchema,
};
