import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { EmployeeListType } from '@/libs/validations/employee';
import {
  approvalEmployeeList,
  CardData,
  DobData,
  getAddEmployeeCharts,
  getEmpDobDate,
} from '@/services/hr/employee.service';

import { UseQueryConfig } from '@/types';

export const useApprovalEmployeeQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['approval-list'],
    queryFn: approvalEmployeeList,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeListType[], Error>;

export const useEmployeeApprovalStatsQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['hrEmployeeApprovalStats'],
    queryFn: () => getAddEmployeeCharts(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<CardData, Error>;

export const useEmployeeDobStatsQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['hrEmployeeDobStats'],
    queryFn: () => getEmpDobDate(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<DobData[], Error>;
