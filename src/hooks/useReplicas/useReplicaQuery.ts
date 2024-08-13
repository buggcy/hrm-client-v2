import { useQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

import { rqhApi, schemaParse } from '@/utils';

import { IReplica, UseQueryConfig } from '@/types';

export const getReplica = (
  id: IReplica['replica_id'],
  config: AxiosRequestConfig,
) =>
  rqhApi
    .get(`/v2/replicas/${id}?verbose=true`, config)
    .then(schemaParse(IReplica));

export const useReplicaQuery = (
  id: IReplica['replica_id'],
  options?: UseQueryConfig<IReplica>,
) =>
  useQuery<IReplica>({
    queryKey: ['replica', id],
    queryFn: ({ signal }) => getReplica(id, { signal }),
    enabled: !!id,
    ...options,
  });
