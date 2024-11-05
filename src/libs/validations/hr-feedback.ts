import { z } from 'zod';

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  companyEmail: z.string().optional(),
  Avatar: z.string().optional(),
  Designation: z.string().optional(),
});

const questionSchema = z.object({
  _id: z.string(),
  questionText: z.string(),
  timestamp: z.string(),
});

const answerSchema = z.object({
  user: userSchema.optional(),
  answer: z.string().optional(),
  timestamp: z.string().optional(),
});

const FeedbackSchema = z.object({
  _id: z.string(),
  __v: z.number(),
  hr: userSchema,
  feedbackTitle: z.string().optional(),
  feedbackCategory: z.string().optional(),
  questions: z.array(questionSchema),
  isDeleted: z.boolean().optional(),
  isSuggestion: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const QuestionAnswerSchema = z.object({
  feedbackId: z.string().optional(),
  _id: z.string().optional(),
  isEnabled: z.boolean().optional(),
  questionText: z.string().optional(),
  timestamp: z.string().optional(),
  answerCount: z.number().optional(),
  answers: z.array(answerSchema).optional(),
});

const feedbackRecordSchema = z.object({
  totalUsers: z.number(),
  averagePercentage: z.number(),
  goodPercentage: z.number(),
  excellentPercentage: z.number(),
  belowAveragePercentage: z.number(),
  veryGoodPercentage: z.number(),
});

const EmployeeFeedbackSchema = z.object({
  _id: z.string().optional(),
  feedbackCategory: z.string().optional(),
  feedbackTitle: z.string().optional(),
  questions: z.array(questionSchema),
  userToAttempted: z.array(z.string()),
});

const FeedbackApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(FeedbackSchema),
});

const QuestionAnswerApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(QuestionAnswerSchema),
});

const FeedbackCardApiResponseSchema = z.object({
  data: feedbackRecordSchema,
});

const EmployeeFeedbackApiResponseSchema = z.object({
  data: z.array(EmployeeFeedbackSchema),
});

export type FeedbackApiResponse = z.infer<typeof FeedbackApiResponseSchema>;
export type FeedbackType = z.infer<typeof FeedbackSchema>;
export type FeedbackArrayType = z.infer<typeof FeedbackSchema>[] | [];

export type EmployeeFeedbackApiResponse = z.infer<
  typeof EmployeeFeedbackApiResponseSchema
>;
export type EmployeeFeedbackType = z.infer<typeof EmployeeFeedbackSchema>;
export type EmployeeFeedbackArrayType =
  | z.infer<typeof EmployeeFeedbackSchema>[]
  | [];

export type FeedbackCardApiResponse = z.infer<
  typeof FeedbackCardApiResponseSchema
>;
export type FeedbackCArdType = z.infer<typeof QuestionAnswerSchema>;

export type QuestionAnswerApiResponse = z.infer<
  typeof QuestionAnswerApiResponseSchema
>;
export type QuestionAnswerType = z.infer<typeof QuestionAnswerSchema>;
export type QuestionAnswerArrayType =
  | z.infer<typeof QuestionAnswerSchema>[]
  | [];

export {
  EmployeeFeedbackApiResponseSchema,
  QuestionAnswerApiResponseSchema,
  FeedbackCardApiResponseSchema,
  FeedbackApiResponseSchema,
  userSchema,
  feedbackRecordSchema,
  paginationSchema,
  QuestionAnswerSchema,
  questionSchema,
  FeedbackSchema,
  answerSchema,
};
