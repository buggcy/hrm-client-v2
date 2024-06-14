import { FC, useState } from 'react';

import { LoaderCircle, TrashIcon } from 'lucide-react';

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

import { useDeleteVideoMutation } from '@/hooks';
import { queryClient } from '@/libs';
import { cn } from '@/utils';

import { IVideo } from '@/types';

export const DeleteVideoBtn: FC<{
  id: IVideo['video_id'];
  className?: string;
  onDeleted?: () => void;
}> = ({ id, className, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteVideoMutation({
    onSuccess() {
      setOpen(false);
      // TODO: update cache and add delete status for video
      void queryClient.invalidateQueries({ queryKey: ['videos'] });
      onDeleted?.();
    },
  });

  const handleDelete = () => {
    void mutate(id);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="destructive-inverted"
          className={cn('flex items-center gap-2', className)}
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <TrashIcon className="size-4" />
          )}
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="relative"
          >
            {isPending && <LoaderCircle className="size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
