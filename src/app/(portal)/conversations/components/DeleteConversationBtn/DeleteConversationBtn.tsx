import { FC, useState } from 'react';

import { Phone, TrashIcon } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

import {
  useDeleteConversationMutation,
  useEndConversationMutation,
} from '@/hooks';
import { queryClient } from '@/libs';
import { cn } from '@/utils';

import { ConversationStatus, IConversation } from '@/types';

export const DeleteConversationBtn: FC<{
  id?: IConversation['conversation_id'];
  status?: IConversation['status'];
  className?: string;
  onDeleted?: () => void;
}> = ({ id, status, className, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteConversationMutation({
      onSuccess() {
        setOpen(false);
        void queryClient.invalidateQueries({ queryKey: ['conversations'] });
        onDeleted?.();
      },
      onError() {
        setOpen(false);
        toast({
          title: 'Error',
          description: 'Failed to delete conversation',
          variant: 'error',
        });
      },
    });

  const { mutate: endMutate, isPending: isEndPending } =
    useEndConversationMutation({
      onSuccess() {
        void queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
      onError() {
        toast({
          title: 'Error',
          description: 'Failed to end conversation',
          variant: 'error',
        });
      },
    });

  const handleDelete = () => {
    void deleteMutate(id as string);
  };

  const handleEnd = () => {
    void endMutate(id as string);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      {status === ConversationStatus.ACTIVE && (
        <LoadingButton
          variant="destructive-inverted"
          className={cn('flex items-center gap-2', className)}
          onClick={handleEnd}
          loading={isEndPending}
        >
          <Phone className="size-4 rotate-[135deg]" /> End Conversation
        </LoadingButton>
      )}
      {status === ConversationStatus.ENDED && (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="destructive-inverted"
              className={cn('flex items-center gap-2', className)}
              onClick={handleDelete}
            >
              <TrashIcon className="size-4" /> Delete Conversation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm delete</DialogTitle>
              <DialogDescription>
                You will no longer be able to access this conversation.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <LoadingButton
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeletePending}
                className="relative"
                loading={isDeletePending}
              >
                Delete
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
