'use client';
import { FC, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Close, Content } from '@radix-ui/react-dialog';
import { ChevronsRight, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetOverlay,
  SheetPortal,
  sheetVariants,
} from '@/components/ui/sheet';

import { useConversationQuery } from '@/hooks/useConversations';
import { cn } from '@/utils';

import { ConversationDetailsSheetProps, ConversationId } from './types';
import { ConversationBlock } from '../ConversationBlock';
import { ConversationInfoBlock } from '../ConversationInfoBlock';
import { DeleteConversationBtn } from '../DeleteConversationBtn';

import { ConversationStatus } from '@/types';

const PARAM_KEY = 'conversation_id';

export const useConversationDetailsSheet = () => {
  const [conversationId, setConversationId] = useState<ConversationId>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const id = searchParams.get(PARAM_KEY);
    if (id) {
      setConversationId(id);
    }
  }, [searchParams]);

  const onOpenChange = (id?: ConversationId) => {
    if (id) {
      setConversationId(id);
    } else {
      setConversationId(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete(PARAM_KEY);
      const paramsString = params.toString();

      router.push(pathname + (paramsString ? `?${paramsString}` : ''));
    }
  };

  const onOpen = (id: ConversationId) => {
    if (!id) return;
    setConversationId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set(PARAM_KEY, id);

    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    onOpen,
    onOpenChange,
    conversationId,
  };
};

const ConversationDetailsSheet: FC<ConversationDetailsSheetProps> = ({
  id,
  onOpenChange,
}) => {
  const { data: conversation, isLoading } = useConversationQuery(id as string, {
    enabled: !!id,
  });

  return (
    <Sheet open={!!id} onOpenChange={() => onOpenChange()}>
      <SheetPortal>
        <SheetOverlay />
        <Content
          className={cn(
            sheetVariants({ side: 'right' }),
            'bottom-2 right-2 top-2 flex h-auto w-[calc(100%-1rem)] flex-col gap-4 overflow-auto rounded-md p-4 sm:w-[460px] sm:max-w-[460px]',
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
            {/* <Button variant="outline" asChild>
              <Link
                target="_blank"
                href={`/conversations/details?id=${conversation?.conversation_id}`}
              >
                Conversation Details
                <ArrowUpRight className="size-4" />
              </Link>
            </Button> */}
            <DeleteConversationBtn
              id={conversation?.conversation_id as string}
              status={conversation?.status}
              className="ml-auto"
              onDeleted={onOpenChange}
            />
          </div>
          <div className="mb-2">
            <ConversationBlock replica_id={conversation?.replica_id} />
          </div>
          <ConversationInfoBlock
            name={conversation?.conversation_name}
            id={conversation?.conversation_id}
            created_at={conversation?.created_at}
            status={conversation?.status}
            persona_id={conversation?.persona_id}
            replica_id={conversation?.replica_id}
            conversation_url={conversation?.conversation_url}
          />
          {conversation?.status === ConversationStatus.ACTIVE && (
            <div className="sticky bottom-0 mt-auto flex items-center justify-end">
              <Button asChild>
                <a
                  href={conversation?.conversation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Conversation
                </a>
              </Button>
            </div>
          )}
        </Content>
      </SheetPortal>
    </Sheet>
  );
};

export { ConversationDetailsSheet };
