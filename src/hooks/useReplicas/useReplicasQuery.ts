import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { z } from 'zod';

import { rqhApi, schemaParse } from '@/utils';

import { IReplica } from '@/types';

const IReplicasResponse = z.object({
  data: z.array(IReplica),
  total_count: z.number(),
});
type IReplicasResponse = z.infer<typeof IReplicasResponse>;

export const getReplicas = () =>
  rqhApi.get('/v2/replicas').then(schemaParse(IReplicasResponse));

export const useReplicasQuery = (
  options?: UseQueryOptions<IReplicasResponse>,
): UseQueryResult<IReplicasResponse> => {
  return useQuery<IReplicasResponse>({
    queryKey: ['replicas'],
    queryFn: getReplicas,
    ...options,
  });
};
