import { PayFormData } from '@/components/data-table/actions/hr-payroll.actions';

import {
  HRPayrollApiResponse,
  HRPayrollApiResponseSchema,
} from '@/libs/validations/hr-payroll';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from './employee.service';

export interface HRPayrollListParams {
  page?: number;
  limit?: number;
  month?: string;
  year?: string;
  payStatus?: string[];
}

export const getPayrollList = async (
  params: HRPayrollListParams = {},
): Promise<HRPayrollApiResponse> => {
  const defaultParams: HRPayrollListParams = {
    page: 1,
    limit: 5,
    month: '',
    year: '',
    payStatus: [],
  };

  const mergedParams = { ...defaultParams, ...params };

  try {
    const response = await baseAPI.post(`/v2/payroll`, mergedParams);
    return schemaParse(HRPayrollApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};

export const searchHRPayrollList = async ({
  query,
  page,
  limit,
  month,
  year,
  payStatus = [],
}: {
  query: string;
  page: number;
  limit: number;
  month?: string;
  year?: string;
  payStatus: string[];
}): Promise<HRPayrollApiResponse> => {
  const { data, pagination }: HRPayrollApiResponse = await baseAPI.post(
    `/v2/payroll/search`,
    { query, page, limit, month, year, payStatus },
  );

  return { data, pagination };
};

export const payPayroll = async (
  data: PayFormData,
): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/update-payroll-status`,
    data,
  );
  return { message };
};
