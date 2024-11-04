import {
  HrDashboardStatsApiResponse,
  hrDashboardStatsApiResponseSchema,
} from '@/libs/validations/hr-dashboard';
import { baseAPI, schemaParse } from '@/utils';

export const getDashboardStats =
  async (): Promise<HrDashboardStatsApiResponse> => {
    const res = await baseAPI.get(`/hr/dashboard-stats`);
    return schemaParse(hrDashboardStatsApiResponseSchema)(res);
  };
