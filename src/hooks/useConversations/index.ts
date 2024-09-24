import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { z } from 'zod';

import { queryClient } from '@/libs';
import { baseAPI, schemaParse } from '@/utils';

import { IConversation, UseQueryConfig } from '@/types';

export const CreateConversationSchema = z
  .object({
    replica_id: z.string().optional(),
    persona_id: z.string().optional(),
    webhook_url: z
      .string()
      .url({
        message: 'Webhook URL must be a valid URL',
      })
      .optional(),
    conversation_name: z
      .string()
      // TODO: verify limits
      .max(255, {
        message: 'Conversation name must be less than 255 characters',
      })
      .optional(),
    conversational_context: z
      .string()
      .max(5000, {
        message: 'Conversational context must be less than 5000 characters',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.replica_id && !data.persona_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either Replica or Persona is required',
      });
    }
  });
export type CreateConversationSchema = z.infer<typeof CreateConversationSchema>;

export const useCreateConversationMutation = (
  options?: UseMutationOptions<IConversation, Error, CreateConversationSchema>,
) =>
  useMutation<IConversation, Error, CreateConversationSchema>({
    mutationFn: (body: CreateConversationSchema) =>
      baseAPI.post('/v2/conversations/', body).then(schemaParse(IConversation)),
    ...options,
  });

export const IConversationsResponse = z.object({
  data: z.array(IConversation),
  total_count: z.number(),
});

export type IConversationsResponse = z.infer<typeof IConversationsResponse>;

type UseConversationsQueryParams = UseQueryConfig<IConversationsResponse>;

export const useConversationsQuery = ({
  queryKey,
  queryParams,
  ...config
}: UseConversationsQueryParams = {}) =>
  useQuery({
    queryKey: queryKey || ['conversations', queryParams],
    queryFn: ({ signal }) =>
      baseAPI
        .get('/v2/conversations', {
          params: { ...queryParams, sort: 'desc' },
          signal,
        })
        .then(schemaParse(IConversationsResponse))
        .then(data => {
          data.data.forEach(conversation => {
            queryClient.setQueryData(
              ['conversation', conversation.conversation_id],
              conversation,
            );
          });
          return data;
        }),
    ...config,
  });

export const useConversationQuery = (
  id: IConversation['conversation_id'],
  config: UseQueryConfig<IConversation> = {},
) =>
  useQuery<IConversation, Error>({
    queryKey: ['conversation', id],
    queryFn: () =>
      baseAPI.get(`/v2/conversations/${id}`).then(schemaParse(IConversation)),
    ...config,
  });

export const useEndConversationMutation = (
  options?: UseMutationOptions<void, Error, IConversation['conversation_id']>,
) =>
  useMutation<void, Error, IConversation['conversation_id']>({
    mutationFn: (conversationId: IConversation['conversation_id']) =>
      baseAPI.post(`/v2/conversations/${conversationId}/end`),
    ...options,
  });

export const useDeleteConversationMutation = (
  options?: UseMutationOptions<void, Error, IConversation['conversation_id']>,
) =>
  useMutation<void, Error, IConversation['conversation_id']>({
    mutationFn: (id: IConversation['conversation_id']) =>
      baseAPI.delete(`/v2/conversations/${id}`),
    ...options,
  });
