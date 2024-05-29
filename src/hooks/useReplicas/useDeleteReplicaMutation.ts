import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { rqhApi } from '@/utils';

import { IReplica } from '@/types';

export const deleteReplica: MutationFunction<void, IReplica['replica_id']> = (
  id: IReplica['replica_id'],
) => rqhApi.delete(`/v2/replicas/${id}`);

export const useDeleteReplicaMutation = (
  options: UseMutationOptions<void, Error, IReplica['replica_id']> = {},
) =>
  useMutation<void, Error, IReplica['replica_id']>({
    mutationFn: deleteReplica,
    // TODO: add cache invalidation
    ...options,
  });
