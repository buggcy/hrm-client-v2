import {
  HrDashboardStatsApiResponse,
  hrDashboardStatsApiResponseSchema,
} from '@/libs/validations/hr-dashboard';
import { baseAPI, schemaParse } from '@/utils';
export interface dashboardParams {
  month?: string;
  year?: string;
}

export const getDashboardStats = async (
  params: dashboardParams = {},
): Promise<HrDashboardStatsApiResponse> => {
  const defaultParams: dashboardParams = {
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
      `/hr/dashboard-stats?${queryParams.toString()}`,
    );
    return schemaParse(hrDashboardStatsApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching dashboard statistics data!', error);
    throw error;
  }
};
