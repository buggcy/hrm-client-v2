import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { PerkRecordApiResponse } from '@/libs/validations/perk';
import {
  getPerkRecords,
  PerkList,
  PerkListParams,
  PerkRecordParams,
  postPerkList,
} from '@/services/employee/perk.service';

import { UseQueryConfig } from '@/types';
import { PerkApiResponse } from '@/types/perk.types';

export const useAllPerkQuery = (id: string, config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['allPerk', id],
    queryFn: () => PerkList(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AxiosResponse, Error>;

export const usePerkListPostQuery = (
  id: string,
  params: PerkListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['perkPostList', id, params],
    queryFn: () => postPerkList(params, id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<PerkApiResponse, Error>;

export const usePerkRecordQuery = (
  id: string,
  params: PerkRecordParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['perkRecords', id, params],
    queryFn: () => getPerkRecords(params, id),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<PerkRecordApiResponse, Error>;
