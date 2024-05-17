import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { HttpService } from '@/utils';

import { IReplica } from '@/types';

export type RenameReplicaDto = Pick<IReplica, 'replica_id' | 'replica_name'>;

export const renameReplica: MutationFunction<void, RenameReplicaDto> = ({
  replica_id,
  replica_name,
}) =>
  HttpService.patch(`/proxy/rqh/v2/replicas/${replica_id}`, {
    replica_name,
  });

export const useRenameReplicaMutation = (
  options: UseMutationOptions<void, Error, RenameReplicaDto> = {},
): UseMutationResult<void, Error, RenameReplicaDto> =>
  useMutation<void, Error, RenameReplicaDto>({
    mutationFn: renameReplica,
    // TODO: add cache invalidation
    ...options,
  });
