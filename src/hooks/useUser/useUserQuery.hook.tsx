import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getUser } from '@/services';

import { IUser, UseQueryConfig } from '@/types';

export const useUserQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<IUser, Error>;
