import { FC, useState } from 'react';

import { Trash2Icon } from 'lucide-react';

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

import { useDeletePersonaMutation } from '@/hooks/usePersonas';
import { queryClient } from '@/libs';
import { cn } from '@/utils';

import { IPersona } from '@/types';

export const DeletePersonaBtn: FC<{
  id?: IPersona['persona_id'];
  className?: string;
  onDeleted?: () => void;
}> = ({ id, className, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeletePersonaMutation({
      onSuccess() {
        setOpen(false);
        void queryClient.invalidateQueries({ queryKey: ['personas-q'] });
        toast({
          title: 'Success',
          description: 'Persona deleted successfully',
          variant: 'success',
        });
        onDeleted?.();
      },
      onError() {
        setOpen(false);
        toast({
          title: 'Error',
          description: 'Failed to delete persona',
          variant: 'error',
        });
      },
    });

  const handleDelete = () => {
    void deleteMutate(id as string);
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
          <Trash2Icon className="size-4" /> Delete Persona
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>
            You will no longer be able to access this Persona.
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
  );
};
