import {
  EmployeeFeedbackApiResponseSchema,
  FeedbackApiResponse,
  FeedbackApiResponseSchema,
  FeedbackCardApiResponseSchema,
  FeedbackChatApiResponseSchema,
  QuestionAnswerApiResponse,
  QuestionAnswerApiResponseSchema,
} from '@/libs/validations/hr-feedback';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from './employee.service';

export interface FeedbackParams {
  page?: number;
  limit?: number;
  status?: string[];
}

export const getFeedbacks = async (
  params: FeedbackParams = {},
): Promise<FeedbackApiResponse> => {
  const defaultParams: FeedbackParams = {
    page: 1,
    limit: 5,
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/get/feedbacks`, mergedParams);
    return schemaParse(FeedbackApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching Logs list:', error);
    throw error;
  }
};

export const searchFeedback = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<FeedbackApiResponse> => {
  const { data, pagination }: FeedbackApiResponse = await baseAPI.get(
    `/search/feedbacks?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};

export const getQuestionAnswer = async (
  id: string,
  params: FeedbackParams = {},
): Promise<QuestionAnswerApiResponse> => {
  const defaultParams: FeedbackParams = {
    page: 1,
    limit: 5,
  };

  const mergedParams = { ...defaultParams, ...params };

  const queryParams = new URLSearchParams(
    Object.entries(mergedParams).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  try {
    const response = await baseAPI.get(
      `/get/all/question/answer/${id}?${queryParams.toString()}`,
    );
    return schemaParse(QuestionAnswerApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching Question Answers!', error);
    throw error;
  }
};

export const searchQuestionAnswer = async ({
  query,
  page,
  limit,
  id,
}: {
  query: string;
  page: number;
  limit: number;
  id: string;
}): Promise<FeedbackApiResponse> => {
  const { data, pagination }: FeedbackApiResponse = await baseAPI.get(
    `/search/all/question/answer/${id}?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};

export const deleteQuestion = async (payload: {
  questionId: string;
  id: string;
}): Promise<SuccessMessageResponse> => {
  const { questionId, id } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/delete/feedback/questions/${id}/${questionId}`,
  );
  return { message };
};

export const deleteFeedback = async (payload: {
  id: string;
}): Promise<SuccessMessageResponse> => {
  const { id } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/delete/feedback/${id}`,
  );
  return { message };
};

export const editQuestion = async (payload: {
  id: string;
  questionId: string;
  questionText?: string;
}): Promise<SuccessMessageResponse> => {
  const { id, questionId, questionText } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/update/feedback/questions/${id}/${questionId}`,
    {
      questionText,
    },
  );
  return { message };
};

export const enableDisableFeedback = async (payload: {
  id: string;
  isEnabled?: boolean;
}): Promise<SuccessMessageResponse> => {
  const { id, isEnabled } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/enable/feedback/questions/${id}`,
    {
      isEnabled,
    },
  );
  return { message };
};
export interface Editbody {
  feedbackTitle?: string;
  question?: string[];
  feedbackCategory?: string;
  isEnabled?: boolean;
  deleteQuestions?: string[];
  isContinue?: boolean;
  startDate?: string;
  endDate?: string;
}
interface Addbody {
  hr: string;
  feedbackTitle?: string;
  question?: string[];
  feedbackCategory: string;
  isEnabled?: boolean;
  isSuggestion?: boolean;
  isContinue?: boolean;
  startDate?: string;
  endDate?: string;
}

export const addFeedback = async (payload: {
  body: Addbody;
}): Promise<SuccessMessageResponse> => {
  const { body } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/add/feedbacks`,
    body,
  );
  return { message };
};

export const updateFeedback = async (payload: {
  id: string;
  body: Editbody;
}): Promise<SuccessMessageResponse> => {
  const { id, body } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/update/feedback/${id}`,
    body,
  );
  return { message };
};

export const getFeedbackCardData = async (id: string) => {
  try {
    const response = await baseAPI.get(`/feedback/record/${id}`);
    return schemaParse(FeedbackCardApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching feedback records!', error);
    throw error;
  }
};

export const getEmployeeFeedback = async () => {
  try {
    const response = await baseAPI.get(`/active/feedbacks`);
    return schemaParse(EmployeeFeedbackApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching emmployee feedback!', error);
    throw error;
  }
};
interface Answer {
  questionId: string;
  answerText: string;
}

interface Answerbody {
  userId: string;
  answer: Answer[];
}
export const addAnswer = async (payload: {
  id: string;
  body: Answerbody;
}): Promise<SuccessMessageResponse> => {
  const { id, body } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/add/answers/${id}`,
    body,
  );
  return { message };
};

export const getFeedbackChart = async () => {
  try {
    const response = await baseAPI.get(`/feedback/statistics`);
    return schemaParse(FeedbackChatApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching feedback statistics!', error);
    throw error;
  }
};
