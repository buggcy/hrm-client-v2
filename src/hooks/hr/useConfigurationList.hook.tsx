import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  ConfigurationApiResponse,
  TaxApiResponse,
} from '@/libs/validations/hr-configuration';
import {
  ConfigurationParams,
  getConfigurationType,
  getTaxType,
} from '@/services/hr/hrConfiguration.service';

import { UseQueryConfig } from '@/types';

export const useConfigurationQuery = (
  params: ConfigurationParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getType', params],
    queryFn: () => getConfigurationType(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ConfigurationApiResponse, Error>;

export const useTaxQuery = (
  params: ConfigurationParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getTax', params],
    queryFn: () => getTaxType(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<TaxApiResponse, Error>;
