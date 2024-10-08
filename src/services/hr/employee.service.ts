import { AxiosResponse } from 'axios';

import { ApprovalEmployeeType } from '@/app/(portal)/(hr)/hr/approval/ApprovalCard/ApprovalCard';
import { AddEmployeeFormData } from '@/app/(portal)/(hr)/hr/manage-employees/components/EmployeeModal';
import {
  EmployeeApiResponse,
  employeeApiResponseSchema,
  EmployeeListType,
} from '@/libs/validations/employee';
import { baseAPI, schemaParse } from '@/utils';

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  gender?: string[];
}

export interface EditProfileResponse {
  message: string;
  token: string;
}
export type SuccessMessageResponse = {
  message: string;
};

export const getEmployeeList = async (
  params: EmployeeListParams = {},
): Promise<EmployeeApiResponse> => {
  const defaultParams: EmployeeListParams = {
    page: 1,
    limit: 5,
    gender: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/v2/employee`, mergedParams);
    return schemaParse(employeeApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const searchEmployeeList = async ({
  query,
  page,
  limit,
  gender,
}: {
  query: string;
  page: number;
  limit: number;
  gender: string[];
}): Promise<EmployeeApiResponse> => {
  const { data, pagination }: EmployeeApiResponse = await baseAPI.post(
    `/v2/employee/search`,
    { query, page, limit, gender },
  );

  return { data, pagination };
};

export const approvalEmployeeList = async (): Promise<
  AxiosResponse<EmployeeListType[]>
> => {
  const res = await baseAPI.get(`/user/unapproved`);
  return res;
};

export const addEmployeeData = async ({
  firstName,
  lastName,
  email,
  companyEmail,
  contactNo,
  basicSalary,
  Joining_Date,
  Designation,
}: AddEmployeeFormData): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(`/employee`, {
    firstName,
    lastName,
    email: email.toLowerCase(),
    companyEmail: companyEmail.toLowerCase(),
    contactNo,
    basicSalary,
    Joining_Date,
    Designation,
  });
  return { message };
};

export const exportEmployeeCSVData = async (
  ids: Array<string>,
): Promise<string> => {
  const res = await baseAPI.post(`/user/export-csv`, { ids });
  return res.data;
};

export const deleteEmployeeRecord = async (
  id: string,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/employee/${id}`,
  );

  return { message };
};

export const employeeApprovalRequest = async (
  data: ApprovalEmployeeType,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/approve-employee`,
    data,
  );
  return { message };
};

export const ReadEmployeeRecord = async (
  id: string,
): Promise<AxiosResponse> => {
  const res = await baseAPI.get(`/employee/${id}`);
  return res;
};

export const ChangePassword = async ({
  id,
  oldPassword,
  newPassword,
}: {
  id: string;
  oldPassword: string;
  newPassword: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/change-password/${id}`,
    {
      oldPassword,
      newPassword,
    },
  );
  return { message };
};

export const EditProfile = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<EditProfileResponse> => {
  const { message, token }: EditProfileResponse = await baseAPI.put(
    `/employee/edit/profile/${id}`,
    formData,
  );
  return { message, token };
};
