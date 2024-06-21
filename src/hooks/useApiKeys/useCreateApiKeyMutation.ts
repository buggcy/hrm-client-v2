import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { portalApi } from '@/utils';

export type CreateApiKeyDto = {
  name: string;
  ips: string[];
};

type ApiKeyResponse = {
  'api-key': string;
};

export const createApiKey: MutationFunction<ApiKeyResponse, CreateApiKeyDto> = (
  data: CreateApiKeyDto,
) => portalApi.post('/v2/api-key', data);

export const useCreateApiKeyMutation = (
  options?: UseMutationOptions<ApiKeyResponse, Error, CreateApiKeyDto>,
) =>
  useMutation<ApiKeyResponse, Error, CreateApiKeyDto>({
    mutationFn: createApiKey,
    ...options,
  });
