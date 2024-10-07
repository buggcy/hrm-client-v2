import {
  attendanceHistoryApiResponseSchema,
  AttendanceStatsApiResponseSchema,
} from '@/libs/validations/attendance-history';
import { baseAPI, schemaParse } from '@/utils';

import {
  AttendanceApiResponse,
  AttendanceHistoryApiResponse,
} from '@/types/attendance-history.types';

export interface AttendanceHistoryListParams {
  id?: string;
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}

export const getAttendanceHistoryList = async (
  params: AttendanceHistoryListParams = {},
): Promise<AttendanceHistoryApiResponse> => {
  const defaultParams: AttendanceHistoryListParams = {
    id: '',
    page: 1,
    limit: 5,
    from: '',
    to: '',
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
      `/attendence-history-user-v2?${queryParams.toString()}`,
    );
    return schemaParse(attendanceHistoryApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const searchAttedanceHistoryList = async ({
  page,
  limit,
  id,
  from = new Date(),
  to = new Date(),
}: {
  query: string;
  page: number;
  limit: number;
  id: string;
  from?: Date;
  to?: Date;
}): Promise<AttendanceHistoryApiResponse> => {
  const res = await baseAPI.get(
    `/attendence-history-user-v2?page=${page}&limit=${limit}&id=${id}&from=${from?.toISOString()}&to=${to?.toISOString()}`,
  );
  return schemaParse(attendanceHistoryApiResponseSchema)(res);
};

export const getAttendanceHistoryStats = async ({
  id,
  from = '',
  to = '',
}: {
  id: string;
  from?: string;
  to?: string;
}): Promise<AttendanceApiResponse> => {
  const res = await baseAPI.get(
    `/attendance-stats-v2?userId=${id}&from=${from}&to=${to}`,
  );
  return schemaParse(AttendanceStatsApiResponseSchema)(res);
};

export const exportAttendanceHistoryCSVData = async (
  ids: Array<string>,
): Promise<BlobPart> => {
  const res: BlobPart = await baseAPI.post(`/attendences/export-csv`, { ids });
  return res;
};
