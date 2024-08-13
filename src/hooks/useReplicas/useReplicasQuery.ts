import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { z } from 'zod';

import { queryClient } from '@/libs';
import { rqhApi, schemaParse } from '@/utils';

import { IReplica } from '@/types';

const IReplicasResponse = z.object({
  data: z.array(IReplica),
  // total_count: z.number(), NOT IMPLEMENTED YET
});
type IReplicasResponse = z.infer<typeof IReplicasResponse>;

type UseReplicaQueryParams = {
  // TODO: Define the type of the queryParams like in API
  queryParams?: Record<string, unknown>;
} & Omit<
  UseInfiniteQueryOptions<IReplicasResponse>,
  | 'queryKey'
  | 'queryFn'
  | 'initialPageParam'
  | 'getPreviousPageParam'
  | 'getNextPageParam'
>;

export const getReplicas = (config?: AxiosRequestConfig) =>
  // TODO: filter by schemaParse
  rqhApi
    .get('/v2/replicas?verbose=true', config)
    .then(schemaParse(IReplicasResponse));

export const useReplicasQuery = ({
  queryParams,
  ...config
}: UseReplicaQueryParams = {}) =>
  useInfiniteQuery<IReplicasResponse, Error>({
    queryKey: ['replicas', queryParams],
    queryFn: ({ pageParam, signal }) =>
      getReplicas({
        params: { ...queryParams, page: pageParam },
        signal,
      }).then(data => {
        data.data.forEach(replica => {
          queryClient.setQueryData(['replica', replica.replica_id], replica);
        });
        return data;
      }),
    initialPageParam: 1,
    getNextPageParam: (data, _, lastPageParam) => {
      if (data?.data?.length >= 10) {
        const last = typeof lastPageParam === 'number' ? lastPageParam : 1;
        return last + 1;
      }
      return undefined;
    },
    ...config,
    select: undefined,
  });
