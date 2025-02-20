import { AxiosResponse } from 'axios';

import {
  EmployeePayrollApiResponse,
  employeePayrollApiResponseSchema,
} from '@/libs/validations/employee';
import { baseAPI, schemaParse } from '@/utils';

export interface PayrollListParams {
  page?: number;
  limit?: number;
  userId: string;
  Date?: string;
  Basic_Salary?: string;
  Tax_Amount?: string;
  Working_Days?: string;
  Total_SalaryDeducton?: string;
  Net_Salary?: string;
  Paid_Amount?: string;
  Pay_Status?: string;
}

export interface PayrollV2Params {
  page?: number;
  limit?: number;
  userId?: string;
  status?: string[];
}

export const postPayout = async (
  params: PayrollV2Params = {},
): Promise<EmployeePayrollApiResponse> => {
  const defaultParams: PayrollV2Params = {
    page: 1,
    limit: 5,
    userId: '',
    status: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/read/v2/payoutbyId`, mergedParams);
    return schemaParse(employeePayrollApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching payroll data:', error);
    throw error;
  }
};

export const searchPayoutList = async ({
  query,
  page,
  limit,
  userId,
  status = [],
}: {
  query: string;
  page: number;
  limit: number;
  userId: string;
  status: string[];
}): Promise<EmployeePayrollApiResponse> => {
  const { data, pagination }: EmployeePayrollApiResponse = await baseAPI.post(
    `/search/payout`,
    { query, page, limit, userId, status },
  );

  return { data, pagination };
};

export const getPayrollList = async (
  params: PayrollListParams = {
    userId: '',
  },
): Promise<EmployeePayrollApiResponse> => {
  const defaultParams: PayrollListParams = {
    page: 1,
    limit: 5,
    userId: '',
    Date: '',
    Basic_Salary: '',
    Tax_Amount: '',
    Working_Days: '',
    Total_SalaryDeducton: '',
    Net_Salary: '',
    Paid_Amount: '',
    Pay_Status: '',
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
      `/payoutbyidV2?${queryParams.toString()}`,
    );
    return schemaParse(employeePayrollApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const searchEmployeePayrollList = async ({
  query,
  page,
  limit,
  userId,
}: {
  query: string;
  page: number;
  limit: number;
  userId: string;
}): Promise<EmployeePayrollApiResponse> => {
  const res = await baseAPI.get(
    `/payoutbyidV2?page=${page}&limit=${limit}&userId=${userId}&month=${query}`,
  );
  return schemaParse(employeePayrollApiResponseSchema)(res);
};

export const exportEmployeePayrollCSVData = async (
  ids: Array<string>,
): Promise<BlobPart> => {
  const res: BlobPart = await baseAPI.post(`/payroll/export-csv`, { ids });
  return res;
};

export const deleteEmployeePayrollRecord = async (
  id: string,
): Promise<AxiosResponse> => {
  const res = await baseAPI.delete(`/employee/${id}`);
  return res;
};
