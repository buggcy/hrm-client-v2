import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { rqhApi, schemaParse } from '@/utils';

import { IReplica } from '@/types';

export const getReplica = (id: IReplica['replica_id']) =>
  rqhApi.get(`/v2/replicas/${id}/?verbose=true`).then(schemaParse(IReplica));

export const useReplicaQuery = (
  id: IReplica['replica_id'],
  options?: Omit<UseQueryOptions<IReplica>, 'queryKey'>,
) =>
  useQuery<IReplica>({
    queryKey: ['replica', id],
    queryFn: () => getReplica(id),
    ...options,
  });
