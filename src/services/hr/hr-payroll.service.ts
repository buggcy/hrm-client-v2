import {
  PayrollRecordApiResponse,
  payrollRecordApiResponseSchema,
} from '@/libs/validations/hr-payroll';
import { baseAPI, schemaParse } from '@/utils';

export interface PayrollRecordParams {
  month?: string;
  year?: string;
}
export const getPayrollStatistics = async (
  params: PayrollRecordParams = {},
): Promise<PayrollRecordApiResponse> => {
  const defaultParams: PayrollRecordParams = {
    month: '',
    year: '',
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
