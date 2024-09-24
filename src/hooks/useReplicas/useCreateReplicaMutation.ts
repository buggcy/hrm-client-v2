import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { baseAPI } from '@/utils';

import { IReplica } from '@/types';

export enum ReplicaModel {
  PHOENIX_1 = 'phoenix-1',
  PHOENIX_2 = 'phoenix-2',
}

export type CreateReplicaDto = {
  replica_name?: IReplica['replica_name'];
  consent_video_url?: string;
  train_video_url: string;
  model_name: ReplicaModel;
};

export const createReplica: MutationFunction<IReplica, CreateReplicaDto> = (
  data: CreateReplicaDto,
) => baseAPI.post('/v2/replicas', data);

export const useCreateReplicaMutation = (
  options?: UseMutationOptions<IReplica, Error, CreateReplicaDto>,
) =>
  useMutation<IReplica, Error, CreateReplicaDto>({
    mutationFn: createReplica,
    // TODO: add cache invalidation
    ...options,
  });
