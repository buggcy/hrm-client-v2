import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getPerkList, PerkListParams } from '@/services/employee/perk.service';

import { UseQueryConfig } from '@/types';
import { PerkApiResponse } from '@/types/perk.types';

export const usePerkListQuery = (
  id: string,
  params: PerkListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['perkList', id, params],
    queryFn: () => getPerkList(params, id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<PerkApiResponse, Error>;
