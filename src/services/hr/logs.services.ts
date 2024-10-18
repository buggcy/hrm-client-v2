// import { AxiosResponse } from 'axios';

import {
  LogsApiResponse,
  logsApiResponseSchema,
} from '@/libs/validations/logs';
import { baseAPI, schemaParse } from '@/utils';

export interface LogsListParams {
  page?: number;
  limit?: number;
  date?: string;
}

export const getLogsList = async (
  params: LogsListParams = {},
): Promise<LogsApiResponse> => {
  const defaultParams: LogsListParams = {
    page: 1,
    limit: 5,
    date: new Date().toISOString().split('T')[0],
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
    const response = await baseAPI.get(`/logs?${queryParams.toString()}`);
    return schemaParse(logsApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching logs list:', error);
    throw error;
  }
};

export const searchLogsList = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<LogsApiResponse> => {
  const { data, pagination }: LogsApiResponse = await baseAPI.get(
    `/logs/search?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};
