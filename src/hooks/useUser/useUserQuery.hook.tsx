import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { HttpService, schemaParse } from '@/utils';

import { IUser } from '@/types';

export const useUserQuery = (
  config: Omit<UseQueryOptions, 'queryKey' | 'queryFn'> = {},
) =>
  useQuery({
    ...config,
    queryKey: ['user'],
    queryFn: (): Promise<IUser> =>
      HttpService.get('/v3/users/me').then(schemaParse(IUser)),
  }) as UseQueryResult<IUser, Error>;
