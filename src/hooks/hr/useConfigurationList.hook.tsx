import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  ConfigurationParams,
  getConfigurationType,
} from '@/services/hr/hrConfiguration.service';

import { UseQueryConfig } from '@/types';
import { ConfigurationApiResponse } from '@/types/hr-configuration.types';

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
