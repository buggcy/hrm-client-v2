import { AxiosResponse } from 'axios';

import {
  AllowedLeaveApiResponse,
  EmployeeLeavesDataApiResponseSchema,
} from '@/libs/validations/leave-history';
import {
  ExtraLeaveApiResponse,
  extraLeaveApiResponseSchema,
} from '@/libs/validations/manage-leave';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from './employee.service';

import { EmployeePerks } from '@/types/manageLeave.types';

export interface UpdateAllowedLeaveBody {
  Annual_Leaves?: number;
  Casual_Leaves?: number;
  Sick_Leaves?: number;
}

export interface AddAllowedLeaveBody {
  leavesAllowed: number;
  month: string;
  title: string;
}

export interface ExtraLeaveParams {
  page?: number;
  limit?: number;
}

export const EmployeePerkList = async (): Promise<
  AxiosResponse<EmployeePerks[]>
> => {
  const res = await baseAPI.get(`/employee/perks`);
  return res;
};

export const AllowLeaveList = async (
  id: string,
): Promise<AllowedLeaveApiResponse> => {
  const res = await baseAPI.get(`/allowed-leaves/get-leaves/${id}`);
  return schemaParse(EmployeeLeavesDataApiResponseSchema)(res);
};

export const UpdateAllowedLeave = async ({
  id,
  body,
}: {
  id: string;
  body: UpdateAllowedLeaveBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/allowed-leaves/update-leaves/${id}`,
    body,
  );
  return { message };
};

export const AddExtraLeave = async ({
  id,
  body,
}: {
  id: string;
  body: AddAllowedLeaveBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/allowed-leaves/add-extra-leaves/${id}`,
    body,
  );
  return { message };
};

export const UpdateExtraLeave = async ({
  id,
  leaveId,
  body,
}: {
  id: string;
  leaveId: string;
  body: AddAllowedLeaveBody;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/allowed-leaves/edit-extra-leaves/${id}/${leaveId}`,
    body,
  );
  return { message };
};

export const DeleteExtraLeave = async ({
  id,
  leaveId,
}: {
  id: string;
  leaveId: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/allowed-leaves/delete-extra-leaves/${id}/${leaveId}`,
  );
  return { message };
};

export const getExtraLeave = async (
  id: string,
  params: ExtraLeaveParams = {},
): Promise<ExtraLeaveApiResponse> => {
  const defaultParams: ExtraLeaveParams = {
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
      `/allowed-leaves/get-extra-leaves/${id}?${queryParams.toString()}`,
    );
    return schemaParse(extraLeaveApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching extra leave!', error);
    throw error;
  }
};

export const searchLeaveList = async ({
  id,
  query,
  page,
  limit,
}: {
  id: string;
  query: string;
  page: number;
  limit: number;
}): Promise<ExtraLeaveApiResponse> => {
  const { data, pagination }: ExtraLeaveApiResponse = await baseAPI.get(
    `/allowed-leaves/search-extra-leaves/${id}?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};
