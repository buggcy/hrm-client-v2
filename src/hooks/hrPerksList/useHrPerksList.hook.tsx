import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  HrEmployeeAllPerksApiResponse,
  HrPerkListApiResponse,
} from '@/libs/validations/hr-perks';
import {
  fetchEmployeesAllPerks,
  fetchEmployeesForPerks,
  fetchPerkRequests,
  getHrDataTablePerksRequest,
  getHrPerksList,
  getPerkCardRecords,
  HrPerkRequestsParams,
  HrPerkRequestsTableParams,
  HrPerksListParams,
} from '@/services/hr/perks-list.service';

import { UseQueryConfig } from '@/types';
import {
  HrPerkRecordApiResponse,
  HrPerkRequestsApiResponse,
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
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrPerksGetEmployeesApiResponse, Error>;

export const useHrPerkRequestsTableQuery = (
  params: HrPerkRequestsTableParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['hrPerkRequests', params],
    queryFn: () => getHrDataTablePerksRequest(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrPerkListApiResponse, Error>;

export const useHrPerkRequestsQuery = (
  params: HrPerkRequestsParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['hrPerkRequests', params],
    queryFn: () => fetchPerkRequests(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrPerkRequestsApiResponse, Error>;

export const useHrEmpoyeeAllPerksQuery = (
  params: { id: string },
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['hrEmployeePerksList', params],
    queryFn: () => fetchEmployeesAllPerks(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrEmployeeAllPerksApiResponse, Error>;

export const useHrPerkRecordQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['hrPerkRecords'],
    queryFn: () => getPerkCardRecords(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrPerkRecordApiResponse, Error>;
