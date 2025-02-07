import {
  AttendanceRequestStatsAPIResponse,
  attendanceRequestStatsAPIResponseSchema,
} from '@/libs/validations/attendance-request';
import { baseAPI, schemaParse } from '@/utils';

export type SuccessMessageResponse = {
  message: string;
};

export type AttendanceRequestStatsParams = {
  from?: string;
  to?: string;
};

export type AttendanceRequestsParams = {
  from?: string;
  to?: string;
  date?: string;
  status?: string[];
};

export const getAttendanceRequestStats = async (
  params: AttendanceRequestStatsParams = {},
): Promise<AttendanceRequestStatsAPIResponse> => {
  const defaultParams: AttendanceRequestStatsParams = {
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
      `/getAttendanceRequestsStats?${queryParams.toString()}`,
    );
    return schemaParse(attendanceRequestStatsAPIResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const getAttendanceRequests = async (
  params: AttendanceRequestsParams = {},
): Promise<AttendanceRequestStatsAPIResponse> => {
  const defaultParams: AttendanceRequestsParams = {
    from: '',
    to: '',
    date: '',
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/getAttendanceRequests`, {
      from: mergedParams.from,
      to: mergedParams.to,
      date: mergedParams.date,
      status: mergedParams.status,
    });
    return schemaParse(attendanceRequestStatsAPIResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const requestAttendance = async (
  formData: FormData,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/addAttendanceRequest`,
    formData,
  );
  return { message };
};
