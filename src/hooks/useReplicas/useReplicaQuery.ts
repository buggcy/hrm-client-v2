import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { HttpService, schemaParse } from '@/utils';

import { IReplica } from '@/types';

export const getReplica = (id: IReplica['replica_id']) =>
  HttpService.get(`/proxy/rqh/v2/replicas/${id}`).then(schemaParse(IReplica));

export const useReplicaQuery = (
  id: IReplica['replica_id'],
  options?: UseQueryOptions<IReplica>,
) => {
  return useQuery<IReplica>({
    queryKey: ['replica', id],
    queryFn: () => getReplica(id),
    ...options,
  });
};
