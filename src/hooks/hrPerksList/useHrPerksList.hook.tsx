import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  fetchEmployeesAllPerks,
  fetchEmployeesForPerks,
  getHrPerksList,
  HrPerksListParams,
} from '@/services/hr/perks-list.service';

import { UseQueryConfig } from '@/types';
import {
  HrEmployeeAllPerksApiResponse,
  HrPerksGetEmployeesApiResponse,
  HrPerksListApiResponse,
} from '@/types/hr-perks-list.types';

export const useHrPerksListQuery = (
  params: HrPerksListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['hrPerksList', params],
    queryFn: () => getHrPerksList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrPerksListApiResponse, Error>;

export const useHrPerksEmpoyeeQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['hrPerksEmployeeList'],
    queryFn: () => fetchEmployeesForPerks(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrPerksGetEmployeesApiResponse, Error>;

export const useHrEmpoyeeAllPerksQuery = (
  params: { id: string },
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['hrEmployeePerksList', params],
    queryFn: () => fetchEmployeesAllPerks(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrEmployeeAllPerksApiResponse, Error>;
