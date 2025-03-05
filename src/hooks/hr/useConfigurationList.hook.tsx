import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ConfigurationApiResponse } from '@/libs/validations/hr-configuration';
import {
  ConfigurationParams,
  getConfigurationType,
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
