import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { portalApi, schemaParse } from '@/utils';

import { IUser } from '@/types';

export const useUserQuery = (
  config: Omit<UseQueryOptions, 'queryKey' | 'queryFn'> = {},
) =>
  useQuery({
    ...config,
    queryKey: ['user'],
    queryFn: (): Promise<IUser> =>
      portalApi.get('/v3/users/me').then(schemaParse(IUser)),
  }) as UseQueryResult<IUser, Error>;
