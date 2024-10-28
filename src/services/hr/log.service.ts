import {
  logApiResponseSchema,
  LogListApiResponse,
} from '@/libs/validations/hr-log';
import { baseAPI, schemaParse } from '@/utils';

export interface LogParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  status?: string[];
}

export const postLogList = async (
  params: LogParams = {},
): Promise<LogListApiResponse> => {
  const defaultParams: LogParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/v2/logs`, mergedParams);
    return schemaParse(logApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching Logs list:', error);
    throw error;
  }
};

export const searchLog = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<LogListApiResponse> => {
  const { data, pagination }: LogListApiResponse = await baseAPI.get(
    `/search/logs?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};
