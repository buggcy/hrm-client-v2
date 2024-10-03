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
  month?: number;
  year?: number;
}

export const getAttendanceHistoryList = async (
  params: AttendanceHistoryListParams = {},
): Promise<AttendanceHistoryApiResponse> => {
  const defaultParams: AttendanceHistoryListParams = {
    id: '',
    page: 1,
    limit: 5,
    month: 9,
    year: 2024,
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
  month,
  year,
}: {
  query: string;
  page: number;
  limit: number;
  id: string;
  month: number;
  year: number;
}): Promise<AttendanceHistoryApiResponse> => {
  const res = await baseAPI.get(
    `/attendence-history-user-v2?page=${page}&limit=${limit}&id=${id}&month=${month}&year=${year}`,
  );
  return schemaParse(attendanceHistoryApiResponseSchema)(res);
};

export const getAttendanceHistoryStats = async ({
  id,
  month,
  year,
}: {
  id: string;
  month: number;
  year: number;
}): Promise<AttendanceApiResponse> => {
  const res = await baseAPI.get(
    `/attendance-stats-v2?userId=${id}&month=${month}&year=${year}`,
  );
  return schemaParse(AttendanceStatsApiResponseSchema)(res);
};

export const exportAttendanceHistoryCSVData = async (
  ids: Array<string>,
): Promise<BlobPart> => {
  const res: BlobPart = await baseAPI.post(`/attendences/export-csv`, { ids });
  return res;
};
