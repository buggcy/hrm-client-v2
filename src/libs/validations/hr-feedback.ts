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
  isEnabled: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const FeedbackApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(FeedbackSchema),
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

const QuestionAnswerApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(QuestionAnswerSchema),
});

export type FeedbackApiResponse = z.infer<typeof FeedbackApiResponseSchema>;
export type FeedbackType = z.infer<typeof FeedbackSchema>;
export type FeedbackArrayType = z.infer<typeof FeedbackSchema>[] | [];

export type QuestionAnswerApiResponse = z.infer<
  typeof QuestionAnswerApiResponseSchema
>;
export type QuestionAnswerType = z.infer<typeof QuestionAnswerSchema>;
export type QuestionAnswerArrayType =
  | z.infer<typeof QuestionAnswerSchema>[]
  | [];

export {
  QuestionAnswerApiResponseSchema,
  FeedbackApiResponseSchema,
  userSchema,
  paginationSchema,
  QuestionAnswerSchema,
  questionSchema,
  FeedbackSchema,
  answerSchema,
};
