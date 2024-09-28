import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getTypes } from '@/services';

import { UseQueryConfig } from '@/types';
import { ITypedataResponse } from '@/types/type.types';

export const useTypesQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['types'],
    queryFn: getTypes,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ITypedataResponse, Error>;
