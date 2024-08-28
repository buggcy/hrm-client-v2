'use client';
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Close, Content } from '@radix-ui/react-dialog';
import { ChevronsRight, Loader } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { ScriptTextArea } from '@/components/ScriptTextArea';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetOverlay,
  SheetPortal,
  sheetVariants,
} from '@/components/ui/sheet';
import { toast } from '@/components/ui/use-toast';

import { useCreateConversationMutation } from '@/hooks';
import { usePersonaQuery } from '@/hooks/usePersonas';
import { cn } from '@/utils';

import { PersonaDetailsSheetProps, PersonaId } from './types';
import { DeletePersonaBtn } from '../DeletePersonaBtn';
import { PersonaInfoBlock } from '../PersonaInfoBlock';
import { PersonaThumbnail } from '../PersonaThumbnail';

const PARAM_KEY = 'persona_id';

export const usePersonaDetailsSheet = () => {
  const [personaId, setPersonaId] = useState<PersonaId>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const id = searchParams.get(PARAM_KEY);
    if (id) {
      setPersonaId(id);
    }
  }, [searchParams]);

  const onOpenChange = (id?: PersonaId) => {
    if (id) {
      setPersonaId(id);
    } else {
      setPersonaId(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete(PARAM_KEY);
      const paramsString = params.toString();

      router.push(pathname + (paramsString ? `?${paramsString}` : ''));
    }
  };

  const onOpen = (id: PersonaId) => {
    if (!id) return;
    setPersonaId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set(PARAM_KEY, id);

    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    onOpen,
    onOpenChange,
    personaId,
  };
};

const PersonaDetailsSheet: FC<PersonaDetailsSheetProps> = ({
  id,
  onOpenChange,
}) => {
  const router = useRouter();
  const { data: persona, isLoading } = usePersonaQuery(id as string, {
    enabled: !!id,
  });
  const { mutateAsync, isPending } = useCreateConversationMutation();

  const handleJoin = () => {
    toast({
      variant: 'progress',
      title: 'Creating conversation...',
      description: 'Please wait while we create a conversation for you.',
    });

    mutateAsync({
      persona_id: persona?.persona_id,
    })
      .then(data => {
        window.open(data.conversation_url, '_blank');
        router.push('/conversations/?conversation_id=' + data.conversation_id);
      })
      .catch(() => {
        toast({
          variant: 'error',
          title: 'Error',
          description:
            'Failed to create conversation. Please try again later, or contact support.',
        });
      });
  };

  return (
    <Sheet open={!!id} onOpenChange={() => onOpenChange()}>
      <SheetPortal>
        <SheetOverlay />
        <Content
          className={cn(
            sheetVariants({ side: 'right' }),
            'bottom-2 right-2 top-2 flex h-auto w-[calc(100%-1rem)] flex-col gap-4 overflow-auto rounded-md p-4 pb-0 sm:w-[460px] sm:max-w-[460px]',
          )}
        >
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white opacity-90">
              <Loader className="size-6 animate-spin" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Close asChild>
              <Button variant="ghost" size="icon">
                <ChevronsRight />
              </Button>
            </Close>
            <DeletePersonaBtn
              id={persona?.persona_id as string}
              className="ml-auto"
              onDeleted={onOpenChange}
            />
          </div>
          <div className="mb-2">
            <PersonaThumbnail replica_id={persona?.default_replica_id} />
          </div>
          <PersonaInfoBlock
            created_at={persona?.created_at}
            name={persona?.persona_name}
            persona_id={persona?.persona_id}
            replica_id={persona?.default_replica_id}
          />
          <ScriptTextArea
            label="System Prompt"
            script={persona?.system_prompt}
          />
          <ScriptTextArea label="Persona Context" script={persona?.context} />
          <div className="sticky bottom-0 mt-auto flex items-center justify-between border-t bg-background py-4">
            <Button variant="primary-inverted" asChild>
              <Link
                href={`/conversations/create?personaId=${persona?.persona_id}`}
                prefetch={false}
              >
                Setup Conversation
              </Link>
            </Button>
            {persona?.default_replica_id && (
              <LoadingButton
                loading={isPending}
                disabled={isPending || isLoading}
                onClick={handleJoin}
              >
                Join Now
              </LoadingButton>
            )}
          </div>
        </Content>
      </SheetPortal>
    </Sheet>
  );
};

export { PersonaDetailsSheet };
