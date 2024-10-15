import {
  HRPayrollApiResponse,
  HRPayrollApiResponseSchema,
} from '@/libs/validations/hr-payroll';
import { baseAPI, schemaParse } from '@/utils';

export interface HRPayrollListParams {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  payStatus?: string[];
}

export const getPayrollList = async (
  params: HRPayrollListParams = {},
): Promise<HRPayrollApiResponse> => {
  const defaultParams: HRPayrollListParams = {
    page: 1,
    limit: 5,
    from: new Date().toISOString(),
    to: new Date().toISOString(),
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
  from = new Date().toISOString(),
  to = new Date().toISOString(),
  payStatus = [],
}: {
  query: string;
  page: number;
  limit: number;
  from: string;
  to: string;
  payStatus: string[];
}): Promise<HRPayrollApiResponse> => {
  const { data, pagination }: HRPayrollApiResponse = await baseAPI.post(
    `/v2/payroll/search`,
    { query, page, limit, from, to, payStatus },
  );

  return { data, pagination };
};
