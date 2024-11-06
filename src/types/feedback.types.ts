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
  isSuggestion?: boolean;
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

export interface IFeedbackCategoryResponse {
  feedbackCategories: Array<string>;
}
export interface EmployeeFeedbackList {
  _id: string;
  feedbackTitle: string;
  questions: Questions[];
  feedbackCategory: string;
  userToAttempted: string[];
}
export interface ChartList {
  name: string;
  count: number;
}

export type feedbackCategories = Array<string>;

export interface FeedBackApiResponse {
  pagination: Pagination;
  data: FeedbackList[];
}

export interface QuestionAnswerApiResponse {
  pagination: Pagination;
  data: QuestionAnswerList[];
}

export interface FeedbackRecordApiResponse {
  data: {
    totalUsers: number;
    averagePercentage: number;
    goodPercentage: number;
    excellentPercentage: number;
    belowAveragePercentage: number;
    veryGoodPercentage: number;
  };
}

export interface EmployeeFeedbackApiResponse {
  data: EmployeeFeedbackList[];
}

export interface FeedbackChartApiResponse {
  distributionChart: {
    totalEnabled: number;
    totalDisabled: number;
  };
  topAnswers: ChartList[];
}
