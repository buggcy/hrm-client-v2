import {
  applyLeaveApiResponseSchema,
  EmployeeLeavesDataApiResponseSchema,
  leaveApiResponseSchema,
  leaveHistoryApiResponseSchema,
} from '@/libs/validations/leave-history';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from '../hr/attendance-list.service';

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
  from?: string;
  to?: string;
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
    from: '',
    to: '',
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
  from = '',
  to = '',
}: {
  query: string;
  page: number;
  limit: number;
  id: string;
  from?: string;
  to?: string;
}): Promise<LeaveHistoryApiResponse> => {
  const res = await baseAPI.get(
    `/leave/all-v2?page=${page}&limit=${limit}&id=${id}&from=${from}&to=${to}&Title=${query}`,
  );
  return schemaParse(leaveHistoryApiResponseSchema)(res);
};

export const getLeaveHistoryStats = async ({
  id,
  from = '',
  to = '',
}: {
  id: string;
  from?: string;
  to?: string;
}): Promise<LeaveApiResponse> => {
  const res = await baseAPI.get(
    `/leave/stats-v2?userId=${id}&from=${from}&to=${to}`,
  );
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
  const res = await baseAPI.post(`/apply-leave-v2`, formData);
  return schemaParse(applyLeaveApiResponseSchema)(res);
};

export const exportLeaveHistoryCSVData = async (
  ids: Array<string>,
): Promise<BlobPart> => {
  const res: BlobPart = await baseAPI.post(`/leavehistory/export-csv`, { ids });
  return res;
};

export const updateLeaveRequest = async ({
  id,
  body,
}: {
  id: string;
  body: FormData;
}): Promise<SuccessMessageResponse> => {
  console.log(id);
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/leave/pending/${id}?status=Pending`,
    body,
  );
  return { message };
};

export const cancelLeaveRequest = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/leave/cancel/${id}`,
  );
  return { message };
};
