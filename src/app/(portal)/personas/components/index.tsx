'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { ArrowRight, Layers, Loader2, User } from 'lucide-react';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { ApiCode } from '@/components/Code';
import { URLS } from '@/components/CopyApiUrl';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { ReplicaPreview } from '@/app/(portal)/components/ReplicaPreview';
import { ReplicaSelect } from '@/app/(portal)/components/ReplicaSelect';
import {
  ICreatePersonaFormStore,
  LLM_ENGINE,
  TTS_ENGINE,
  useCreatePersonaFormStore,
} from '@/app/(portal)/personas/hooks';
import { useCreateConversationMutation, useReplicaQuery } from '@/hooks';
import {
  CreatePersonaSchema,
  useCreatePersonaMutation,
} from '@/hooks/usePersonas';
import { getErrorMessage } from '@/utils';

import { LabelWithPopover } from './LabelWithPopover';
import { LayersInputs } from './LayersInputs';

import { HttpMethods, IReplica } from '@/types';

const getCreatePersonaRequestBody = (
  state: ICreatePersonaFormStore,
): CreatePersonaSchema => {
  const result: CreatePersonaSchema = {
    default_replica_id: state.replicaId,
    system_prompt: state.systemPrompt,
    layers: {
      vqa: {
        enable_vision: state.enableVision,
      },
    },
  };

  if (state.name) result.persona_name = state.name;
  if (state.context) result.context = state.context;
  if (state.ttsEngine && state.ttsEngine !== TTS_ENGINE.DEFAULT) {
    result.layers.tts = {
      tts_engine: state.ttsEngine,
      external_voice_id: state.ttsVoiceId || '',
      api_key: state.ttsApiKey || '',
    };
  }
  if (
    state.llmName &&
    state.llmName !== LLM_ENGINE.CUSTOM &&
    state.llmName !== LLM_ENGINE.TAVUS_LLAMA
  ) {
    result.layers.llm = {
      model: state.llmName,
    };
  }
  if (state.llmName && state.llmName === LLM_ENGINE.CUSTOM) {
    result.layers.llm = {
      model: state.customLLM || '',
      base_url: state.llmApiUrl || '',
      api_key: state.llmApiKey || '',
    };
  }

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
  const [name, context, systemPrompt, enableVision, set] =
    useCreatePersonaFormStore(
      useShallow(state => [
        state.name,
        state.context,
        state.systemPrompt,
        state.enableVision,
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

  const handleCheckedChange = (checked: boolean) => {
    set({ enableVision: checked });
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
      <div className="mb-4 flex gap-2">
        <Checkbox
          id="vision"
          checked={enableVision}
          onCheckedChange={handleCheckedChange}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="vision"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable Vision
          </label>
        </div>
      </div>

      <Label className="mb-2 inline-block">
        Persona Role <span className="text-muted-foreground">(optional)</span>
      </Label>
      <Input
        className="mb-4"
        type="text"
        placeholder="Enter a name for your persona"
        name="name"
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <LabelWithPopover
        popoverContent={
          <p>
            The system prompt is used to craft the replica&apos;s personality
            and how it will respond.
            <br />
            <br />
            Example:
            <br />
            Your role is to be a captivating storyteller influenced by classic
            literature. Focus on rich descriptions, dynamic characters, and
            compelling plots that evoke emotion and wonder.
          </p>
        }
      >
        System Prompt
      </LabelWithPopover>
      <Textarea
        required
        className="mb-4 h-full resize-none"
        placeholder="Enter System Prompt for your persona"
        value={systemPrompt}
        name="systemPrompt"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <LabelWithPopover
        popoverContent={
          <p>
            The persona context is additional information that the replica is
            able to use in its responses.
            <br />
            <br />
            Example:
            <br />
            Don Quixote is a classic novel by Spanish author Miguel de
            Cervantes, first published in two parts in 1605 and 1615. The story
            follows Alonso Quixano, an elderly gentleman who becomes so enamored
            with chivalric romances that he loses his sanity, assumes the
            identity of a knight-errant named Don Quixote, and sets out on a
            series of comical and delusional adventures across Spain.
            Accompanied by his loyal squire Sancho Panza, Don Quixote&apos;s
            misadventures, including his famous tilting at windmills mistaken
            for giants, serve as a satirical critique of the romanticized
            chivalric literature of Cervantes&apos; time while exploring themes
            of reality, identity, and the nature of heroism.
          </p>
        }
      >
        Conversational Context{' '}
        <span className="text-muted-foreground">(optional)</span>
      </LabelWithPopover>
      <Textarea
        className="h-full resize-none"
        placeholder="Enter Context for your persona"
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
        const message = issues.map(issue => issue.message).join('; ');

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
        className="size-full overflow-y-scroll"
      >
        <Tabs
          defaultValue="persona"
          className="flex size-full w-full flex-col items-center justify-start gap-6"
        >
          <TabsList className="w-fit">
            <TabsTrigger className="gap-1.5" value="persona">
              <User className="size-4" />
              Persona
            </TabsTrigger>
            <TabsTrigger className="gap-1.5" value="layers">
              <Layers className="size-4" />
              Layers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="persona" className="size-full flex-1">
            <div className="flex h-full flex-col gap-4">
              <CreatePersonaReplicaSelect />
              <CreatePersonaInputs />
            </div>
          </TabsContent>
          <TabsContent value="layers" className="size-full flex-1">
            <LayersInputs />
          </TabsContent>
        </Tabs>
      </form>
      <footer className="sticky bottom-0 flex flex-col items-end">
        <div className="flex flex-wrap items-end justify-end gap-4 lg:flex-nowrap">
          <Button
            variant="outline"
            id={START_CONVERSATION_BUTTON_ID}
            onClick={() => handleSubmit()}
            disabled={isGenerating}
            className="text-pretty"
          >
            Create and Start Conversation
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
