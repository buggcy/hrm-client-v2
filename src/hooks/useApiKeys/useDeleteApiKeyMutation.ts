import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { portalApi } from '@/utils';

import { IApiKey } from '@/types';

export const deleteApiKey: MutationFunction<void, string> = (
  id: IApiKey['key_prefix'],
) => portalApi.delete(`/v2/api-key/${id}`);

export const useDeleteApiKeyMutation = (
  options: UseMutationOptions<void, Error, string> = {},
) =>
  useMutation<void, Error, string>({
    mutationFn: deleteApiKey,
    ...options,
  });
