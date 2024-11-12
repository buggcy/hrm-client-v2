import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getProjectList,
  getProjectRecords,
  getProjects,
  ProjectParams,
  RecordParams,
} from '@/services/hr/project-department.service';

import { UseQueryConfig } from '@/types';
import {
  ProjectApiResponse,
  ProjectChartApiResponse,
  ProjectListApiResponse,
} from '@/types/project-department.types';

export const useProjectQuery = (
  params: ProjectParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getProjects', params],
    queryFn: () => getProjects(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ProjectApiResponse, Error>;

export const useProjectListQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['projectList'],
    queryFn: () => getProjectList(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ProjectListApiResponse, Error>;

export const useProjectStatisticsQuery = (
  params: RecordParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['projectRecords', params],
    queryFn: () => getProjectRecords(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ProjectChartApiResponse, Error>;
