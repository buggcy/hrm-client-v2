export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  companyEmail?: string;
  Avatar?: string;
  Designation?: string;
}

export interface Questions {
  questionText: string;
  timestamp: string;
  _id: string;
}

export interface Answers {
  user: UserType;
  answer: string;
  timestamp: string;
}

export interface FeedbackList {
  _id: string;
  __v: number;
  hr: UserType;
  feedbackTitle?: string;
  questions: Questions[];
  feedbackCategory?: string;
  isDeleted?: boolean;
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionAnswerList {
  feedbackId: string;
  isEnabled?: boolean;
  _id: string;
  questionText?: string;
  timestamp?: string;
  answers: Answers[];
  answerCount?: number;
}

export interface FeedBackApiResponse {
  pagination: Pagination;
  data: FeedbackList[];
}

export interface QuestionAnswerApiResponse {
  pagination: Pagination;
  data: QuestionAnswerList[];
}
