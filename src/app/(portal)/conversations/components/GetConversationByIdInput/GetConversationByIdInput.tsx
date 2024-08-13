'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { useConversationQuery } from '@/hooks/useConversations';

export const GetConversationByIdInput = () => {
  const router = useRouter();

  const [conversationId, setConversationId] = useState('');
  const {
    data: conversation,
    refetch,
    isFetching,
  } = useConversationQuery(conversationId, {
    enabled: false,
    retry: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 10) return;
    setConversationId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversationId || conversationId.length !== 10) {
      toast({
        title: 'Invalid conversation ID',
        description: 'Please enter a valid conversation ID',
        variant: 'error',
      });
      return;
    }
    if (conversation?.conversation_id) {
      router.push(`/conversation/details?id=${conversationId}`);
      return;
    }
    if ((await refetch()).data) {
      router.push(`/conversation/details?id=${conversationId}`);
    } else {
      toast({
        title: 'conversation not found',
        description: 'Please enter a valid conversation ID',
        variant: 'error',
      });
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="flex w-full items-center gap-2">
        <div className="flex w-full items-center gap-1 rounded-md bg-accent p-2.5">
          <code className="inline-flex gap-1 text-sm text-muted-foreground">
            <span className="font-medium">GET</span>
            <span className="">|</span>
            <span className="">/</span>
            <span className="text-foreground">v2</span>
            <span className="">/</span>
            <span className="text-foreground">conversations</span>
            <span className="">/</span>
          </code>
          <input
            value={conversationId}
            onChange={handleInputChange}
            maxLength={10}
            type="text"
            placeholder="{enter conversations ID here}"
            className="h-5 w-full rounded-md border border-none bg-accent p-0 text-muted-foreground focus:outline-none focus:ring-0"
          />
        </div>
        <Button
          disabled={isFetching}
          type="submit"
          className="relative px-6"
          variant="outline"
        >
          GET
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader className="size-4 animate-spin" />
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};
