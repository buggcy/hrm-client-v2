import {
  attendanceListApiResponseSchema,
  AttendanceListStatsApiResponseSchema,
} from '@/libs/validations/attendance-list';
import { baseAPI, schemaParse } from '@/utils';

import {
  AttendanceListApiResponse,
  AttendanceListStatsApiResponse,
} from '@/types/attendance-list.types';

export interface AttendanceListParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  date?: string;
  Status?: string;
  Total_Time?: string;
  Productivity?: string;
  breaks?: string;
  fullname?: string;
  Start_Time?: string;
}

export const searchAttedanceList = async ({
  page,
  limit,
  query,
  from = new Date(),
  to = new Date(),
}: {
  page: number;
  limit: number;
  query: string;
  from?: Date;
  to?: Date;
}): Promise<AttendanceListApiResponse> => {
  const res = await baseAPI.get(
    `/attendence-history-user-v2?page=${page}&limit=${limit}&query=${query}&from=${from?.toISOString()}&to=${to?.toISOString()}`,
  );
  return schemaParse(attendanceListApiResponseSchema)(res);
};

export const getAttendanceList = async (
  params: AttendanceListParams = {},
): Promise<AttendanceListApiResponse> => {
  const defaultParams: AttendanceListParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    date: '',
    Status: '',
    Total_Time: '',
    Productivity: '',
    breaks: '',
    fullname: '',
    Start_Time: '',
  };

  const mergedParams = {
    ...defaultParams,
    ...params,
  };

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
      `/attendence-v2?${queryParams.toString()}`,
    );
    return schemaParse(attendanceListApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const getAttendanceListStats = async ({
  from = '',
  to = '',
}: {
  from?: string;
  to?: string;
}): Promise<AttendanceListStatsApiResponse> => {
  const res = await baseAPI.get(
    `/attendence-overview-v2?from=${from}&to=${to}`,
  );
  return schemaParse(AttendanceListStatsApiResponseSchema)(res);
};
