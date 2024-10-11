import { AxiosResponse } from 'axios';

import {
  AllowedLeaveApiResponse,
  EmployeeLeavesDataApiResponseSchema,
} from '@/libs/validations/leave-history';
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

export const AddAllowedLeave = async ({
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
