import { FC } from 'react';
import { useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { Check, Link } from 'lucide-react';

import { CopyRequestID } from '@/components/CopyRequestID';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useCopyToClipboard } from '@/hooks';
import { cn } from '@/utils';

import { DeleteConversationBtn } from '../DeleteConversationBtn';

import { ConversationStatus, IConversation } from '@/types';

const Item = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-full max-w-38.5">
      <p className="text-sm font-semibold">{label}</p>
    </div>
    <div className="w-full">{children}</div>
  </div>
);

export const ConversationInfoBlock: FC<{
  id?: IConversation['conversation_id'];
  created_at?: IConversation['created_at'];
  status?: IConversation['status'];
  name?: IConversation['conversation_name'];
  persona_id?: IConversation['persona_id'];
  replica_id?: IConversation['replica_id'];
  conversation_url?: IConversation['conversation_url'];
  withDelete?: boolean;
}> = ({
  id,
  created_at,
  status,
  name,
  persona_id,
  replica_id,
  conversation_url,
  withDelete,
}) => {
  const router = useRouter();
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: conversation_url,
  });
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-xl font-semibold">{name}</h3>
        {withDelete && (
          <DeleteConversationBtn
            id={id}
            onDeleted={() => {
              router.push('/conversations');
            }}
          />
        )}
      </div>

      <div className="space-y-4">
        <Item label="Conversation ID">
          <CopyRequestID id={id} />
        </Item>
        <Item label="Created">
          <p className="text-sm font-medium">
            {created_at && format(created_at, 'MMMM d, h:mm aaa')}
          </p>
        </Item>
        <Item label="Status">
          <p
            className={cn('text-sm font-medium capitalize', {
              'text-success': status === ConversationStatus.ENDED,
              'text-error': status === ConversationStatus.ERROR,
              'text-progress': status === ConversationStatus.ACTIVE,
            })}
          >
            {status}
          </p>
        </Item>

        {persona_id && (
          <Item label="Persona ID">
            <CopyRequestID id={persona_id} />
          </Item>
        )}
        {replica_id && (
          <Item label="Replica ID">
            <CopyRequestID id={replica_id} />
          </Item>
        )}
        <Item label="Conversation Link">
          <div className="relative">
            <Input value={conversation_url} readOnly className="pr-9" />
            <Button
              size="icon"
              className="absolute right-1 top-1 size-8"
              onClick={copyToClipboard}
            >
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Link className="size-4" />
              )}
            </Button>
          </div>
        </Item>
      </div>
    </div>
  );
};
