import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  FeedbackParams,
  getEmployeeFeedback,
  getFeedbackCardData,
  getFeedbackChart,
  getFeedbacks,
  getQuestionAnswer,
} from '@/services/hr/hr-feedback.service';

import { UseQueryConfig } from '@/types';
import {
  EmployeeFeedbackApiResponse,
  FeedBackApiResponse,
  FeedbackChartApiResponse,
  FeedbackRecordApiResponse,
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

export const useFeedbackRecordQuery = (
  category: string,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['feedbackRecord', category],
    queryFn: () => getFeedbackCardData(category),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
    enabled: !!category,
  }) as UseQueryResult<FeedbackRecordApiResponse, Error>;

export const useEmployeeFeedbackQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['getEmployeeFeedback'],
    queryFn: () => getEmployeeFeedback(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeFeedbackApiResponse, Error>;

export const useFeedbackStatisticsQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['feedbackStatistics'],
    queryFn: () => getFeedbackChart(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<FeedbackChartApiResponse, Error>;
