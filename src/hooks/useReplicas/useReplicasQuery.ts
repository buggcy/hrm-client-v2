import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { z } from 'zod';

import { queryClient } from '@/libs';
import { rqhApi, schemaParse } from '@/utils';

import { IReplica } from '@/types';

const IReplicasResponse = z.object({
  data: z.array(IReplica),
  // total_count: z.number(), NOT IMPLEMENTED YET
});
type IReplicasResponse = z.infer<typeof IReplicasResponse>;

export const getReplicas = () =>
  // TODO: filter by schemaParse
  rqhApi.get('/v2/replicas?verbose=true').then(schemaParse(IReplicasResponse));

export const useReplicasQuery = (
  options?: Omit<UseQueryOptions<IReplicasResponse>, 'queryKey' | 'queryFn'>,
): UseQueryResult<IReplicasResponse> =>
  useQuery<IReplicasResponse>({
    queryKey: ['replicas'],
    queryFn: () =>
      getReplicas().then(data => {
        data.data.forEach(replica => {
          queryClient.setQueryData(['replica', replica.replica_id], replica);
        });
        return data;
      }),
    ...options,
  });
