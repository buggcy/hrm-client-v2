import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { EmployeeApiResponse } from '@/libs/validations/employee';
import {
  EmployeeListParams,
  getResignedFiredEmployeeList,
  getUnapprovedEmployeeList,
  ResignationRecordById,
} from '@/services/hr/employee.service';

import { UseQueryConfig } from '@/types';
import { GetResignationByIdResponse } from '@/types/employee.types';

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

export const useResignedFiredEmployeeQuery = (
  params: EmployeeListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['resignedFiredEmployeeList', params],
    queryFn: () => getResignedFiredEmployeeList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeApiResponse, Error>;

export const useReadResignationRecordQuery = (
  id: string,
  config: UseQueryConfig = {},
): UseQueryResult<GetResignationByIdResponse, Error> => {
  return useQuery({
    queryKey: ['resignationRecord', id],
    queryFn: () => ResignationRecordById(id),
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...config,
  }) as UseQueryResult<GetResignationByIdResponse, Error>;
};
