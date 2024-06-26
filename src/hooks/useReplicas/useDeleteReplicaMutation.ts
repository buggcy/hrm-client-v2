import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { queryClient } from '@/libs';
import { rqhApi } from '@/utils';

import { IReplica } from '@/types';

export const deleteReplica: MutationFunction<void, IReplica['replica_id']> = (
  id: IReplica['replica_id'],
) => rqhApi.delete(`/v2/replicas/${id}`);

export const useDeleteReplicaMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<void, Error, IReplica['replica_id']> = {}) =>
  useMutation<void, Error, IReplica['replica_id']>({
    mutationFn: deleteReplica,
    onSuccess: (...data) => {
      onSuccess?.(...data);
      void queryClient.invalidateQueries({ queryKey: ['replicas'] });
    },
    // TODO: add cache invalidation
    ...options,
  });
