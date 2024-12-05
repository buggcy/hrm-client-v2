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
  id: string,
  params: FeedbackParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getQuestionAnswer', id, params],
    queryFn: () => getQuestionAnswer(id, params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
    enabled: !!id,
  }) as UseQueryResult<QuestionAnswerApiResponse, Error>;

export const useFeedbackRecordQuery = (
  id: string,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['feedbackRecord', id],
    queryFn: () => getFeedbackCardData(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
    enabled: !!id,
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
