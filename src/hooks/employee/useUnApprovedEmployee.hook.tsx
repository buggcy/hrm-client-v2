import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  EmployeeListParams,
  getUnapprovedEmployeeList,
} from '@/services/hr/employee.service';

import { UseQueryConfig } from '@/types';
import { EmployeeApiResponse } from '@/types/employee.types';

export const useUnapprovedEmployeeQuery = (
  params: EmployeeListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['unapprovedEmployeeList', params],
    queryFn: () => getUnapprovedEmployeeList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeApiResponse, Error>;
