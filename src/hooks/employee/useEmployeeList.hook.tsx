import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  EmployeeListParams,
  getEmployeeList,
  ReadEmployeeRecord,
} from '@/services/hr/employee.service';

import { UseQueryConfig } from '@/types';
import {
  EmployeeApiResponse,
  GetEmployeeByIdResponse,
} from '@/types/employee.types';

export const useEmployeeListQuery = (
  params: EmployeeListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['employeeList', params],
    queryFn: () => getEmployeeList(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeApiResponse, Error>;

export const useReadEmployeeRecordQuery = (
  id: string,
  config: UseQueryConfig = {},
): UseQueryResult<GetEmployeeByIdResponse, Error> => {
  return useQuery({
    queryKey: ['employeeRecord', id],
    queryFn: () => ReadEmployeeRecord(id),
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...config,
  }) as UseQueryResult<GetEmployeeByIdResponse, Error>;
};
