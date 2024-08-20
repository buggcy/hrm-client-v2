'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { format } from 'date-fns';
import { ChevronRight, CircleHelp, Loader, MonitorDot } from 'lucide-react';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { ApiCode } from '@/components/Code';
import { URLS } from '@/components/CopyApiUrl';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import {
  EmptyList,
  SkeletonList,
} from '@/app/(portal)/components/ListComponents';
import { GenerateSubmitButton } from '@/app/(portal)/components/NoQuotasTooltip';
import { PersonaSelect } from '@/app/(portal)/components/PersonaSelect';
import { ReplicaPreview } from '@/app/(portal)/components/ReplicaPreview';
import { ReplicaSelect } from '@/app/(portal)/components/ReplicaSelect';
import {
  ICreateConversationFormStore,
  useCreateConversationFormStore,
} from '@/app/(portal)/conversations/hooks';
import { useReplicaQuery } from '@/hooks';
import { useUserQuotasQuery } from '@/hooks/useBilling';
import {
  CreateConversationSchema,
  useConversationsQuery,
  useCreateConversationMutation,
} from '@/hooks/useConversations';
import { usePersonaQuery } from '@/hooks/usePersonas';
import { queryClient } from '@/libs';
import { cn, getErrorMessage } from '@/utils';

import { useConversationDetailsSheet } from './ConversationDetailsSheet';

import { HttpMethods, IReplica } from '@/types';

export const LabelWithPopover = ({
  children,
  popoverContent,
  className,
}: {
  children: React.ReactNode;
  popoverContent: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <Label className={(cn('inline-block'), className)}>{children}</Label>
      <Popover>
        <PopoverTrigger>
          <CircleHelp className="size-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="text-xs">{popoverContent}</PopoverContent>
      </Popover>
    </div>
  );
};

export const CreateConversationPersonSelect = () => {
  const [personaId, replicaId] = useCreateConversationFormStore(state => [
    state.personaId,
    state.replicaId,
  ]);
  const { data: persona } = usePersonaQuery(personaId, {
    refetchOnMount: false,
  });

  useEffect(() => {
    if (persona && persona.persona_id === personaId) {
      if (
        persona.default_replica_id &&
        persona.default_replica_id !== replicaId
      ) {
        useCreateConversationFormStore.setState({
          replicaId: persona.default_replica_id,
        });
      }
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona]);

  const onChange = (personaId?: IReplica['replica_id']) => {
    useCreateConversationFormStore.setState({ personaId });
  };

  return <PersonaSelect value={personaId} onChange={onChange} />;
};

export const CreateConversationReplicaSelect = () => {
  const replicaId = useCreateConversationFormStore(state => state.replicaId);

  const onChange = (replicaId: IReplica['replica_id']) => {
    useCreateConversationFormStore.setState({ replicaId });
  };

  return <ReplicaSelect value={replicaId} onChange={onChange} />;
};

export const getCreateConversationRequestBody = (
  state: ICreateConversationFormStore,
): CreateConversationSchema => {
  const result: CreateConversationSchema = {
    replica_id: state.replicaId,
  };

  if (state.webhookUrl) result.webhook_url = state.webhookUrl;
  if (state.name) result.conversation_name = state.name;
  if (state.personaId) result.persona_id = state.personaId;
  if (state.context) result.conversational_context = state.context;

  return result;
};

export const ConversationName = () => {};

const OPTIMISTIC_CONVERSATION_ID = 'optimistic-conversation-id';

const LIMIT = 10;

const queryParams = {
  page: 0,
  limit: LIMIT,
};
const queryKey = ['conversations', queryParams];

const CreateConversationInputs = () => {
  const [name, context, set] = useCreateConversationFormStore(
    useShallow(state => [state.name, state.context, state.set]),
  );

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    set({ [name]: value });
  };

  const handleBlur = (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    set({ [name]: value.trim() });
  };

  return (
    <div className="flex h-full flex-col">
      <Label className="mb-2 inline-block">Conversation Name (optional)</Label>
      <Input
        className="mb-4"
        type="text"
        placeholder="Enter a name for your conversation"
        name="name"
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <LabelWithPopover
        popoverContent={
          <p>
            Conversational context is context that the replica will use for this
            conversation only. The replica will not use this context for other
            conversations.
            <br />
            <br />
            Example: <br />
            You are about to speak with Sarah, a vibrant 35-year-old marketing
            executive. Sarah loves literature and is currently reading Don
            Quioxte. Sarah loves stories that are full of adventure and
            intrigue. She is a fan of the classics and enjoys reading books that
            are rich in history and culture.
          </p>
        }
      >
        Conversation Context (optional)
      </LabelWithPopover>
      <Textarea
        className="h-full resize-none"
        placeholder="Enter context for your conversation"
        value={context}
        name="context"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export const CREATE_CONVERSATION_FORM_ID = 'createConversationForm';

export const CreateConversationForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: quotas, isError } = useUserQuotasQuery();
  const { onOpen } = useConversationDetailsSheet();

  const { mutateAsync: createConversation, isPending: isSubmitting } =
    useCreateConversationMutation({
      // onMutate: async (body: CreateConversationDto) => {
      //   await queryClient.cancelQueries({ queryKey });
      //
      //   const prevData = queryClient.getQueryData(queryKey) as IVideosResponse;
      //   const newVideo: IVideo = {
      //     data: {
      //       script: body.script,
      //       audio_url: body.audio_url,
      //     },
      //     status: VideoStatus.GENERATING,
      //     video_id: OPTIMISTIC_VIDEO_ID,
      //     video_name: body.video_name,
      //     created_at: '',
      //     updated_at: '',
      //     status_details: '',
      //   };
      //
      //   queryClient.setQueryData(queryKey, (prev: IVideosResponse) => ({
      //     data: [newVideo, ...(prev?.data || [])],
      //     total_count: (prev?.total_count || 0) + 1,
      //   }));
      //
      //   return prevData;
      // },
      onError: (error, __, prevData) => {
        queryClient.setQueryData(queryKey, prevData || null);

        toast({
          variant: 'error',
          title: 'Error while creating conversation',
          description: getErrorMessage(error),
        });
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey });
      },
      onSuccess: data => {
        // toast({
        //   variant: 'success',
        //   title: 'Conversation created 🚀',
        //   action: (
        //     <Button asChild>
        //       <a href={data.conversation_url} target="_blank">
        //         Join
        //       </a>
        //     </Button>
        //   ),
        // });
        onOpen(data.conversation_id);
      },
    });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const state = useCreateConversationFormStore.getState();
    const body = getCreateConversationRequestBody(state);

    try {
      validateBody();

      toast({
        variant: 'progress',
        title: 'Processing conversation creation request',
      });

      await createConversation(body);
    } catch (e) {
      console.error(e);
    }

    function validateBody() {
      try {
        CreateConversationSchema.parse(body);
      } catch (_error) {
        const { issues } = _error as z.ZodError<CreateConversationSchema>;
        const message = issues.map(issue => issue.message).join(',');

        toast({
          variant: 'error',
          title: 'Error',
          description: message,
        });

        throw new Error('Invalid form data');
      }
    }
  };

  const isOutOfQuotas = isError
    ? false
    : !(quotas ? quotas.conversation?.isAllowed : true);
  // TODO: IS GENERATING PERSONA
  const isGenerating = isSubmitting;

  useEffect(() => {
    const replicaId = searchParams.get('replicaId');
    const personaId = searchParams.get('personaId');

    if (replicaId || personaId) {
      const state: Partial<ICreateConversationFormStore> = {};

      if (replicaId) state.replicaId = replicaId;
      if (personaId) state.personaId = personaId;

      useCreateConversationFormStore.setState(state);

      const params = new URLSearchParams(searchParams.toString());

      params.delete('replicaId');
      params.delete('personaId');

      const paramsString = params.toString();

      router.push(pathname + (paramsString ? `?${paramsString}` : ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="col-span-1 row-span-2 flex h-[calc(100svh-100px)] flex-col gap-4 rounded-md border border-border bg-background p-4 sm:h-[initial]">
      <form
        id={CREATE_CONVERSATION_FORM_ID}
        onSubmit={handleSubmit}
        className="no-scrollbar flex flex-1 flex-col gap-4"
      >
        <CreateConversationPersonSelect />
        <CreateConversationReplicaSelect />
        <CreateConversationInputs />
      </form>
      <footer className="flex flex-col items-end">
        <Separator className="mb-4" />
        <GenerateSubmitButton
          form={CREATE_CONVERSATION_FORM_ID}
          isGenerating={isGenerating}
          isOutOfQuotas={isOutOfQuotas}
        >
          Create Conversation
        </GenerateSubmitButton>
      </footer>
    </div>
  );
};

export const Preview = () => {
  const replicaId = useCreateConversationFormStore(state => state.replicaId);
  const { data: replica } = useReplicaQuery(replicaId);

  return <ReplicaPreview src={replica?.thumbnail_video_url as string} />;
};

export const Code = () => {
  const state = useCreateConversationFormStore(state => state);
  const body = getCreateConversationRequestBody(state);

  return (
    <ApiCode url={URLS.conversation} method={HttpMethods.POST} body={body} />
  );
};

export const Title = () => {
  const [name, personaId] = useCreateConversationFormStore(
    useShallow(state => [state.name, state.personaId]),
  );
  const { data: persona } = usePersonaQuery(personaId);

  return (
    <div className="grid w-full items-center">
      <h2 className="truncate text-xl font-bold">
        {name || 'Conversation Name'}
      </h2>
      {persona && (
        <p className="text-muted-foreground">{persona.persona_name}</p>
      )}
    </div>
  );
};

export const ConversationsList = () => {
  // TODO: change loading
  const {
    data: conversations,
    isPending,
    isLoading,
    isFetching,
  } = useConversationsQuery({
    queryKey,
    queryParams,
    // refetchInterval: useVideosQueryRefetchInterval,
  });
  const { onOpen } = useConversationDetailsSheet();

  return (
    <div className="col-span-1 row-span-1 flex flex-col gap-1 rounded-md border border-border bg-background p-4">
      <header className="flex items-center justify-between">
        <p className="font-medium">
          Generated Conversations
          {isFetching && !isLoading && (
            <Loader className="ml-2 inline size-5 animate-spin" />
          )}
        </p>
        <Button variant="link" asChild className="p-1 text-muted-foreground">
          <Link href="/conversations">
            All Conversations
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </header>
      <Separator />
      <ul className="-ml-2.5 flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {conversations?.data?.length ? (
          conversations.data.map(
            ({ conversation_id, status, conversation_name, created_at }) => (
              <li
                key={conversation_id}
                onClick={() => onOpen(conversation_id)}
                className={cn(
                  'flex cursor-pointer gap-4 rounded border-2 border-transparent p-2 focus:border-border',
                  {
                    'pointer-events-none opacity-50 hover:border-transparent':
                      conversation_id === OPTIMISTIC_CONVERSATION_ID,
                  },
                )}
              >
                {/*<div className="flex min-h-14 min-w-24 items-center justify-center overflow-hidden rounded border bg-secondary">*/}
                {/*  {still_image_thumbnail_url ? (*/}
                {/*    <img*/}
                {/*      src={still_image_thumbnail_url}*/}
                {/*      alt={video_name || 'Video thumbnail'}*/}
                {/*      className="max-h-13.5 object-contain"*/}
                {/*    />*/}
                {/*  ) : (*/}
                {/*    getIcon(status)*/}
                {/*  )}*/}
                {/*</div>*/}
                <div className="grid w-full grid-cols-[1fr,80px,1fr]">
                  <p className="truncate text-sm font-medium">
                    {conversation_name}
                  </p>
                  <div className="flex justify-center">
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-end text-sm font-medium text-muted-foreground">
                    {format(created_at, 'MMMM d, h:mm aaa')}
                  </p>
                </div>
              </li>
            ),
          )
        ) : isPending ? (
          <SkeletonList />
        ) : (
          <EmptyList
            Icon={MonitorDot}
            title="Your conversations will appear here"
          />
        )}
      </ul>
      {/*<VideoDetailsSheet id={video_id} onOpenChange={onOpenChange} />*/}
    </div>
  );
};
