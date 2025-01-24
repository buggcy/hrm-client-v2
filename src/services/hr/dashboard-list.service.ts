import {
  HrDashboardStatsApiResponse,
  hrDashboardStatsApiResponseSchema,
} from '@/libs/validations/hr-dashboard';
import { baseAPI, schemaParse } from '@/utils';

import { EmployeeDashboardParams } from '../employee/dashboard.service';

export const getDashboardStats = async (
  params: EmployeeDashboardParams = {},
): Promise<HrDashboardStatsApiResponse> => {
  const defaultParams: EmployeeDashboardParams = {
    from: '',
    to: '',
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
      `/hr/dashboard-stats?${queryParams.toString()}`,
    );
    return schemaParse(hrDashboardStatsApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching dashboard statistics data!', error);
    throw error;
  }
};
