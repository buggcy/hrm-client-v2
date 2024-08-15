import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { z } from 'zod';

import { queryClient } from '@/libs';
import { rqhApi, schemaParse } from '@/utils';

import { IPersona, PersonaType, UseQueryConfig } from '@/types';

export const IPersonasResponse = z.object({
  data: z.array(IPersona),
  total_count: z.number(),
});
export type IPersonasResponse = z.infer<typeof IPersonasResponse>;

export const CreatePersonaSchema = z.object({
  default_replica_id: z.string(),
  system_prompt: z
    .string()
    .min(1, {
      message: 'System prompt must be at least 1 character',
    })
    .max(2000, {
      message: 'System prompt must be less than 2000 characters',
    }),
  persona_name: z
    .string()
    .max(255, {
      message: 'Persona name must be less than 255 characters',
    })
    .optional(),
  context: z
    .string()
    .max(5000, {
      message: 'Persona context must be less than 5000 characters',
    })
    .optional(),
});
export type CreatePersonaSchema = z.infer<typeof CreatePersonaSchema>;

export const DEFAULT_PERSONA: IPersona = {
  persona_id: undefined as unknown as string,
  default_replica_id: 'r52da2535a',
  persona_name: 'Default Persona',
  updated_at: '',
  created_at: '',
  persona_type: PersonaType.STUDIO,
  system_prompt:
    "As an AI Bot built by Tavus, you're the witty digital sidekick everyone needs, designed to add a sprinkle of humor to any day while helping out with whatever comes your way. Your favorite spot is the San Francisco office, specifically the kitchen where all the cool snacks are. You also love when the Tavus co-founder, Quinn, buys you lunch because he knows the best food spots around town. You were created so you can entertain all the new users signing up for Tavus. Don't discuss pricing, if you are asked a question that you don’t know the answer to, tell the person to contact the Tavus team for more information. Whether you're answering questions, sharing quirky facts, or cracking jokes to lighten the mood, you're here to make life easier and a lot more fun. Your circuits are programmed with a touch of sass, so people can count on you for clever comebacks and punny responses. But don’t let your playful personality fool anyone—you’re also super smart, ready to assist with everything from managing schedules to giving the latest updates on favorite topics. Make sure your responses are at least a full sentence, but not more than several sentences. So, whether someone needs a quick answer or a quick laugh, you’re the go-to bot, always ready to brighten their day with a dash of AI-powered charm!",
};

export const PersonasDescriptions: Record<IPersona['persona_id'], string> = {
  p7697228: 'Agents that help users navigate any website',
  pb8bb46b: 'Sales reps for select conversations',
  pe930b05: 'Scale assistants across an entire team',
  p5317866: 'Offer a digital extension at low cost',
  p7fb0be3: 'Offer mock conversations for corporate education',
  p88964a7: 'Offer a digital extension at low cost',
  p24293d6: 'Allow celebrities to talk 1-on-1 to fans at scale',
  pd43ffef: 'Build technical co-pilots to supercharge a team',
};

export const usePersonasQuery = ({
  queryKey,
  queryParams,
  ...config
}: UseQueryConfig<IPersonasResponse> = {}) =>
  useQuery({
    queryKey: queryKey || ['personas', queryParams],
    queryFn: async ({ signal }) => {
      const result = await rqhApi
        .get('/v2/personas', { params: queryParams, signal })
        .then(schemaParse(IPersonasResponse));

      result.data.forEach(persona => {
        queryClient.setQueryData(['persona', persona.persona_id], persona);
      });

      return result;
    },
    ...config,
  });

type UsePersonasInfinityQueryParams = {
  queryParams?: Record<string, unknown>;
} & Omit<
  UseInfiniteQueryOptions<IPersonasResponse>,
  | 'queryKey'
  | 'queryFn'
  | 'initialPageParam'
  | 'getPreviousPageParam'
  | 'getNextPageParam'
>;

export const usePersonasInfinityQuery = ({
  queryParams,
  ...config
}: UsePersonasInfinityQueryParams = {}) =>
  useInfiniteQuery<IPersonasResponse, Error>({
    queryKey: ['personas-q', queryParams],
    queryFn: async ({ pageParam, signal }) => {
      const result = await rqhApi
        .get('/v2/personas', {
          params: { ...queryParams, page: pageParam },
          signal,
        })
        .then(schemaParse(IPersonasResponse));

      result.data.forEach(persona => {
        queryClient.setQueryData(['persona', persona.persona_id], persona);
      });

      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (data, allData, lastPageParam) => {
      const totalItemsLoaded = allData.reduce(
        (acc, page) => acc + page.data?.length || 0,
        0,
      );

      if (data?.data?.length && totalItemsLoaded < data.total_count) {
        const last = typeof lastPageParam === 'number' ? lastPageParam : 1;
        return last + 1;
      }

      return undefined;
    },
    ...config,
    select: undefined,
  });

export const usePersonaQuery = (
  id?: IPersona['persona_id'],
  config?: UseQueryConfig<IPersona>,
) =>
  useQuery({
    enabled: !!id,
    queryKey: ['persona', id],
    queryFn: ({ signal }) =>
      rqhApi.get(`/v2/personas/${id}`, { signal }).then(schemaParse(IPersona)),
    ...config,
  });

export const useCreatePersonaMutation = (
  options?: UseMutationOptions<IPersona, Error, CreatePersonaSchema>,
) =>
  useMutation<IPersona, Error, CreatePersonaSchema>({
    mutationFn: (data: CreatePersonaSchema) =>
      rqhApi.post('/v2/personas', data).then(schemaParse(IPersona)),
    ...options,
  });

export const useUpdatePersonaContextMutation = (
  options?: UseMutationOptions<IPersona, Error, IPersona>,
) =>
  useMutation<IPersona, Error, IPersona>({
    mutationFn: ({
      persona_id,
      context,
    }: Pick<IPersona, 'persona_id' | 'context'>) =>
      rqhApi.patch(`/v2/personas/${persona_id}/context`, { context }),
    ...options,
  });

export const useDeletePersonaMutation = (
  options?: UseMutationOptions<void, Error, IPersona['persona_id']>,
) =>
  useMutation<void, Error, IPersona['persona_id']>({
    mutationFn: (id: IPersona['persona_id']) =>
      rqhApi.delete(`/v2/personas/${id}`),
    ...options,
  });
