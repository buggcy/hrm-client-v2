import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  EmployeeListParams,
  getEmployeeList,
} from '@/services/hr/employee.service';

import { UseQueryConfig } from '@/types';
import { EmployeeApiResponse } from '@/types/employee.types';

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
