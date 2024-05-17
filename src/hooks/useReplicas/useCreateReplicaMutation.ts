import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { HttpService } from '@/utils';

import { IReplica } from '@/types';

export type CreateReplicaDto = {
  replica_name: IReplica['replica_name'];
  consent_video_url: string;
  train_video_url: string;
};

export const createReplica: MutationFunction<void, CreateReplicaDto> = (
  data: CreateReplicaDto,
) => HttpService.post('/proxy/rqh/v2/replicas', data);

export const useCreateReplicaMutation = (
  options?: UseMutationOptions<void, Error, CreateReplicaDto>,
) =>
  useMutation<void, Error, CreateReplicaDto>({
    mutationFn: createReplica,
    // TODO: add cache invalidation
    ...options,
  });
