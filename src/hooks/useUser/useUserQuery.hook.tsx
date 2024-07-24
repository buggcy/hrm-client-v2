import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { getUser } from '@/services';

import { IUser } from '@/types';

export const useUserQuery = (
  config: Omit<UseQueryOptions, 'queryKey' | 'queryFn'> = {},
) =>
  useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<IUser, Error>;
