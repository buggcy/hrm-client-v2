import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { portalApi, schemaParse } from '@/utils';

import { IApiKey } from '@/types';

const DataSchema = z.object({
  count: z.number(),
  rows: z.array(IApiKey),
});
type IApiKeysResponse = z.infer<typeof DataSchema>;

type UseApiKeysQueryParams = {
  queryParams?: Record<string, string | number>;
} & Omit<UseQueryOptions<IApiKeysResponse>, 'queryKey' | 'queryFn'>;

export const useApiKeysQuery = ({
  queryParams,
  ...config
}: UseApiKeysQueryParams = {}) =>
  useQuery<IApiKeysResponse>({
    queryKey: ['api-keys', queryParams],
    queryFn: () =>
      portalApi
        .get('/v2/api-key', { params: queryParams })
        .then(data => schemaParse(DataSchema)(data.data)),
    ...config,
  });
