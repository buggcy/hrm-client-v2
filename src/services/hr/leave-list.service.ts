import {
  LeaveListApiResponse,
  leaveListApiResponseSchema,
  LeaveListRecordApiResponse,
  leaveListRecordSchema,
  leaveTrendChartApiResponseSchema,
} from '@/libs/validations/hr-leave-list';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from './employee.service';

export interface LeaveListParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  userId?: string;
  status?: string[];
}

export interface LeaveListRecordParams {
  from?: string;
  to?: string;
}

export interface PendingLeaveRequestParams {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AcceptOrRejectParams {
  hrId: string;
  Status: string;
  rejectedReason?: string;
}

export const postLeaveList = async (
  params: LeaveListParams = {},
): Promise<LeaveListApiResponse> => {
  const defaultParams: LeaveListParams = {
    page: 1,
    limit: 5,
    from: '',
    to: '',
    userId: '',
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/v2/leave/all`, mergedParams);
    return schemaParse(leaveListApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching leave list:', error);
    throw error;
  }
};

export const getLeaveListRecords = async (
  params: LeaveListRecordParams = {},
): Promise<LeaveListRecordApiResponse> => {
  const defaultParams: LeaveListRecordParams = {
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
      `/v2/attendence/records?${queryParams.toString()}`,
    );
    return schemaParse(leaveListRecordSchema)(response);
  } catch (error) {
    console.error('Error fetching leave list records:', error);
    throw error;
  }
};

export const getPendingLeaveRequest = async (
  params: PendingLeaveRequestParams = {},
): Promise<LeaveListApiResponse> => {
  const defaultParams: PendingLeaveRequestParams = {
    from: '',
    to: '',
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
      `/pending/leave/requests?${queryParams.toString()}`,
    );
    return schemaParse(leaveListApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching Pending leave requests!', error);
    throw error;
  }
};

export const searchLeaveList = async ({
  query,
  page,
  limit,
  from,
  to,
  user,
}: {
  query: string;
  page: number;
  limit: number;
  from?: string;
  to?: string;
  user?: string;
}): Promise<LeaveListApiResponse> => {
  const { data, pagination }: LeaveListApiResponse = await baseAPI.get(
    `/search/leave/list?page=${page}&limit=${limit}&query=${query}&from=${from}&to=${to}&user=${user}`,
  );

  return { data, pagination };
};

export const deleteLeaveRecord = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/leave/${id}`,
  );
  return { message };
};

export const acceptLeaveRecord = async (
  id: string,
  hrId: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/approve-leave/${id}`,
    {
      hrId,
      Status: 'Approved',
    },
  );
  return { message };
};

export const rejectLeaveRecord = async (
  id: string,
  hrId: string,
  rejectedReason?: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/approve-leave/${id}`,
    {
      hrId,
      Status: 'Rejected',
      rejectedReason,
    },
  );
  return { message };
};

export const getTrendLeaveChartData = async () => {
  try {
    const response = await baseAPI.get(`/chart/leave/data`);
    return schemaParse(leaveTrendChartApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching Trend leave chart data!', error);
    throw error;
  }
};
