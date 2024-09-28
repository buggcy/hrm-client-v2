import { AxiosResponse } from 'axios';

import { ApprovalEmployeeType } from '@/app/(portal)/(hr)/hr/approval/ApprovalCard/ApprovalCard';
import { AddEmployeeFormData } from '@/app/(portal)/(hr)/hr/manage-employees/components/EmployeeModal';
import {
  employeeApiResponseSchema,
  EmployeeListType,
} from '@/libs/validations/employee';
import { baseAPI, schemaParse } from '@/utils';

import { EmployeeApiResponse } from '@/types/employee.types';

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  gender?: string;
  dob?: string;
  contactNo?: string;
  designation?: string;
  companyEmail?: string;
}

export const getEmployeeList = async (
  params: EmployeeListParams = {},
): Promise<EmployeeApiResponse> => {
  const defaultParams: EmployeeListParams = {
    page: 1,
    limit: 5,
    name: '',
    email: '',
    gender: '',
    dob: '',
    contactNo: '',
    designation: '',
    companyEmail: '',
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
    const response = await baseAPI.get(`/employee?${queryParams.toString()}`);
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
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<AxiosResponse<EmployeeApiResponse>> => {
  const res = await baseAPI.get(
    `/user/search?page=${page}&limit=${limit}&query=${query}`,
  );
  return res;
};

export const approvalEmployeeList = async (): Promise<
  AxiosResponse<EmployeeListType[]>
> => {
  const res = await baseAPI.get(`/user/unapproved`);
  return res;
};

export const addEmployeeData = async (
  data: AddEmployeeFormData,
): Promise<AxiosResponse> => {
  const res = await baseAPI.post(`/employee`, data);
  return res;
};

export const exportEmployeeCSVData = async (
  ids: Array<string>,
): Promise<AxiosResponse> => {
  const res = await baseAPI.post(`/user/export-csv`, { ids });
  return res;
};

export const deleteEmployeeRecord = async (
  id: string,
): Promise<AxiosResponse> => {
  const res = await baseAPI.delete(`/employee/${id}`);
  return res;
};

export const employeeApprovalRequest = async (
  data: ApprovalEmployeeType,
): Promise<AxiosResponse> => {
  const res = await baseAPI.post(`/approve-employee`, data);
  return res;
};
