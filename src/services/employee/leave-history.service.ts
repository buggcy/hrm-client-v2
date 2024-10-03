import {
  applyLeaveApiResponseSchema,
  EmployeeLeavesDataApiResponseSchema,
  leaveApiResponseSchema,
  leaveHistoryApiResponseSchema,
} from '@/libs/validations/leave-history';
import { baseAPI, schemaParse } from '@/utils';

import {
  ApplyLeaveApiResponse,
  EmployeeLeavesDataApiResponse,
  LeaveApiResponse,
  LeaveHistoryApiResponse,
} from '@/types/leave-history.types';

export interface LeaveHistoryListParams {
  id?: string;
  page?: number;
  limit?: number;
  month?: number;
  year?: number;
  Title?: string;
  Description?: string;
  Status?: string;
  Start_Date?: string;
  End_Date?: string;
}

export const getLeaveHistoryList = async (
  params: LeaveHistoryListParams = {},
): Promise<LeaveHistoryApiResponse> => {
  const defaultParams: LeaveHistoryListParams = {
    id: '',
    page: 1,
    limit: 5,
    month: 0,
    year: 0,
    Title: '',
    Description: '',
    Status: '',
    Start_Date: '',
    End_Date: '',
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
      `/leave/all-v2?${queryParams.toString()}`,
    );
    return schemaParse(leaveHistoryApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const searchLeaveHistoryList = async ({
  query,
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
}): Promise<LeaveHistoryApiResponse> => {
  const res = await baseAPI.get(
    `/leave/all-v2?page=${page}&limit=${limit}&id=${id}&month=${month}&year=${year}&Title=${query}`,
  );
  return schemaParse(leaveHistoryApiResponseSchema)(res);
};

export const getLeaveHistoryStats = async ({
  id,
  year,
}: {
  id: string;
  year: number;
}): Promise<LeaveApiResponse> => {
  const res = await baseAPI.get(`/leave/stats-v2?userId=${id}&year=${year}`);
  return schemaParse(leaveApiResponseSchema)(res);
};

export const getLeaveData = async ({
  employeeId,
}: {
  employeeId: string;
}): Promise<EmployeeLeavesDataApiResponse> => {
  const res = await baseAPI.get(`/allowed-leaves/get-leaves/${employeeId}`);
  return schemaParse(EmployeeLeavesDataApiResponseSchema)(res);
};

export const applyLeaveData = async (
  formData: FormData,
): Promise<ApplyLeaveApiResponse> => {
  const res = await baseAPI.post(`/apply-leave`, formData);
  return schemaParse(applyLeaveApiResponseSchema)(res);
};

export const exportLeaveHistoryCSVData = async (
  ids: Array<string>,
): Promise<BlobPart> => {
  const res: BlobPart = await baseAPI.post(`/leavehistory/export-csv`, { ids });
  return res;
};
