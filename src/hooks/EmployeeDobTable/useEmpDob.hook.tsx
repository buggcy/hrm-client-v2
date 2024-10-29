import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { EmpDobListType } from '@/libs/validations/employee';
import { getEmpDobDate } from '@/services/hr/employee.service';
import {
  EmpDobTableParams,
  getEmpAnniversaryTableList,
  getEmpDobTableList,
} from '@/services/hr/employeeDob.service';

import { UseQueryConfig } from '@/types';
import { EmployeeDobTableApiResponse } from '@/types/employeeDobPayroll.types';

export const useEmployeeDobTableQuery = (
  params: EmpDobTableParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['employeeDobTablePayroll', params],
    queryFn: () => getEmpDobTableList(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeDobTableApiResponse, Error>;

export const useEmployeeDobChartQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['employeeDobChartPayroll'],
    queryFn: () => getEmpDobDate(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmpDobListType, Error>;

export const useEmployeeAnniversaryQuery = (
  params: EmpDobTableParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['employeeAnniversaryTable', params],
    queryFn: () => getEmpAnniversaryTableList(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeDobTableApiResponse, Error>;
