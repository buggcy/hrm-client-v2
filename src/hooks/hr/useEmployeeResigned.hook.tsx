import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getPendingResignedRequest,
  GetResignedParams,
  resignedEmployee,
  ResignedParams,
} from '@/services/hr/employee.service';

import { UseQueryConfig } from '@/types';
import { ResignedApiResponse } from '@/types/employee.types';

export const useResignedEmployeeQuery = (
  params: ResignedParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['resignedEmployees', params],
    queryFn: () => resignedEmployee(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ResignedApiResponse, Error>;

export const usePendingResignedRequestQuery = (
  params: GetResignedParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['pendingResigned', params],
    queryFn: () => getPendingResignedRequest(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ResignedApiResponse, Error>;
