'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { ArrowRight, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { ApiCode } from '@/components/Code';
import { URLS } from '@/components/CopyApiUrl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { ReplicaPreview } from '@/app/(portal)/components/ReplicaPreview';
import { ReplicaSelect } from '@/app/(portal)/components/ReplicaSelect';
import {
  ICreatePersonaFormStore,
  useCreatePersonaFormStore,
} from '@/app/(portal)/personas/hooks';
import { useCreateConversationMutation, useReplicaQuery } from '@/hooks';
import {
  CreatePersonaSchema,
  useCreatePersonaMutation,
} from '@/hooks/usePersonas';
import { getErrorMessage } from '@/utils';

import { HttpMethods, IReplica } from '@/types';

const getCreatePersonaRequestBody = (
  state: ICreatePersonaFormStore,
): CreatePersonaSchema => {
  const result: CreatePersonaSchema = {
    default_replica_id: state.replicaId,
    system_prompt: state.systemPrompt,
  };

  if (state.name) result.persona_name = state.name;
  if (state.context) result.context = state.context;

  return result;
};

export const Code = () => {
  const state = useCreatePersonaFormStore(state => state);
  const body = getCreatePersonaRequestBody(state);

  return <ApiCode url={URLS.persona} method={HttpMethods.POST} body={body} />;
};

export const Preview = () => {
  const replicaId = useCreatePersonaFormStore(state => state.replicaId);
  const { data: replica } = useReplicaQuery(replicaId);

  return <ReplicaPreview src={replica?.thumbnail_video_url as string} />;
};

const CreatePersonaReplicaSelect = () => {
  const replicaId = useCreatePersonaFormStore(state => state.replicaId);

  const onChange = (replicaId: IReplica['replica_id']) => {
    useCreatePersonaFormStore.setState({ replicaId });
  };

  return <ReplicaSelect value={replicaId} onChange={onChange} />;
};

const CreatePersonaInputs = () => {
  const [name, context, systemPrompt, set] = useCreatePersonaFormStore(
    useShallow(state => [
      state.name,
      state.context,
      state.systemPrompt,
      state.set,
    ]),
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
      <Label className="mb-2 inline-block">Persona Name</Label>
      <Input
        className="mb-4"
        type="text"
        placeholder="Enter a name for your persona"
        name="name"
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Label className="mb-2 inline-block">System Prompt</Label>
      <Textarea
        required
        className="mb-4 h-full resize-none"
        placeholder="Enter the system prompt that will be used by the llm"
        value={systemPrompt}
        name="systemPrompt"
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Label className="mb-2 inline-block">Persona Context</Label>
      <Textarea
        className="h-full resize-none"
        placeholder="Enter the context of the persona, e.g., “This persona is for testing purposes”"
        value={context!}
        name="context"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

const START_CONVERSATION_BUTTON_ID = 'startConversationButton';
export const CREATE_FORM_ID = 'createPersonaForm';

export const CreatePersonaForm = () => {
  const router = useRouter();
  const {
    mutateAsync: createConversation,
    isPending: isSubmittingConversation,
  } = useCreateConversationMutation({
    onError: error => {
      toast({
        variant: 'error',
        title: 'Error while creating conversation',
        description: getErrorMessage(error),
      });
    },
  });
  const { mutateAsync: createPersona, isPending: isSubmitting } =
    useCreatePersonaMutation({
      onError: error => {
        toast({
          variant: 'error',
          title: 'Error while creating persona',
          description: getErrorMessage(error),
        });
      },
      onSuccess: () => {
        toast({
          variant: 'success',
          title: 'Persona created 🚀',
        });
      },
    });

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const state = useCreatePersonaFormStore.getState();
    const body = getCreatePersonaRequestBody(state);

    try {
      validateBody();

      toast({
        variant: 'progress',
        title: 'Processing persona creation request',
      });

      const persona = await createPersona(body);

      // EVENT NOT DEFINED FOR CREATE PERSONA AND START CONVERSATION
      if (!event) {
        const conversation = await createConversation({
          persona_id: persona.persona_id,
        });
        window.open(conversation.conversation_url, '_blank');
        router.push('/conversations/create?personaId=' + persona.persona_id);
      } else {
        router.push('/personas?persona_id=' + persona.persona_id);
      }

      useCreatePersonaFormStore.setState({
        name: '',
        context: '',
        systemPrompt: '',
      });
    } catch (e) {
      console.error(e);
    }

    function validateBody() {
      try {
        CreatePersonaSchema.parse(body);
      } catch (_error) {
        const { issues } = _error as z.ZodError<CreatePersonaSchema>;
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

  const isGenerating = isSubmitting || isSubmittingConversation;

  return (
    <div className="col-span-1 row-span-2 flex h-[calc(100svh-100px)] flex-col gap-4 rounded-md border border-border bg-background p-4 sm:h-[initial]">
      <form
        id={CREATE_FORM_ID}
        onSubmit={handleSubmit}
        className="no-scrollbar flex flex-1 flex-col gap-4"
      >
        <CreatePersonaReplicaSelect />
        <CreatePersonaInputs />
      </form>
      <footer className="flex flex-col items-end">
        <Separator className="mb-4" />
        <div className="flex items-end gap-4">
          <Button
            variant="outline"
            id={START_CONVERSATION_BUTTON_ID}
            onClick={() => handleSubmit()}
            disabled={isGenerating}
          >
            Create and Start Conversation{' '}
            {isGenerating && <Loader2 className="size-4 animate-spin" />}
          </Button>
          <Button type="submit" disabled={isGenerating} form={CREATE_FORM_ID}>
            Create Persona
            <span className="size-4">
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight size={16} />
              )}
            </span>
          </Button>
        </div>
      </footer>
    </div>
  );
};
