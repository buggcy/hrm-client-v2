import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { z } from 'zod';

import { HttpService } from '@/utils';

const IUser = z.object({
  id: z.string(),
  email: z.string(),
});

type IUser = z.infer<typeof IUser>;

export const useUserQuery = (
  config: Omit<UseQueryOptions, 'queryKey' | 'queryFn'> = {},
) =>
  useQuery({
    ...config,
    queryKey: ['user'],
    queryFn: (): Promise<IUser> =>
      HttpService.get('/v3/users/me').then(IUser.parse),
  }) as UseQueryResult<IUser, Error>;
