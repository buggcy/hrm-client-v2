import {
  PayrollRecordApiResponse,
  payrollRecordApiResponseSchema,
} from '@/libs/validations/hr-payroll';
import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from './employee.service';

export interface PayrollRecordParams {
  from?: string;
  to?: string;
}
export const getPayrollStatistics = async (
  params: PayrollRecordParams = {},
): Promise<PayrollRecordApiResponse> => {
  const defaultParams: PayrollRecordParams = {
    from: new Date().toISOString(),
    to: new Date().toISOString(),
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
      `/monthly/payroll/statistics?${queryParams.toString()}`,
    );
    return schemaParse(payrollRecordApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching payroll statistics:', error);
    throw error;
  }
};

export const refreshPayroll = async ({
  userIds,
  month,
  year,
}: {
  userIds: string[];
  month?: string;
  year?: string;
}): Promise<SuccessMessageResponse> => {
  const body = { userIds, month, year };
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/manual-payroll`,
    body,
  );
  return { message };
};
