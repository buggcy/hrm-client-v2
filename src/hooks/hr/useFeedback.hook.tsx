import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  FeedbackParams,
  getFeedbackCategory,
  getFeedbacks,
  getQuestionAnswer,
} from '@/services/hr/hr-feedback.service';

import { UseQueryConfig } from '@/types';
import {
  FeedBackApiResponse,
  IFeedbackCategoryResponse,
  QuestionAnswerApiResponse,
} from '@/types/feedback.types';

export const useFeedbackQuery = (
  params: FeedbackParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getFeedbacks', params],
    queryFn: () => getFeedbacks(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<FeedBackApiResponse, Error>;

export const useQuestionAnswerQuery = (
  category: string,
  params: FeedbackParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getQuestionAnswer', category, params],
    queryFn: () => getQuestionAnswer(category, params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
    enabled: !!category,
  }) as UseQueryResult<QuestionAnswerApiResponse, Error>;

export const useFeedbackCategoryQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['feedbackCategory'],
    queryFn: getFeedbackCategory,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<IFeedbackCategoryResponse, Error>;
