import { FC, useEffect, useState } from 'react';

import { AlertTriangle } from 'lucide-react';

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

import { LoadingButton } from '../LoadingButton';

export const DeleteDialog: FC<{
  isLoading: boolean;
  description: string;
  children: React.ReactNode;
  isSuccess: boolean;
  onDelete: () => void;
}> = ({ isLoading, isSuccess, description, children, onDelete }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSuccess) setOpen(false);
  }, [isSuccess]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <span>
              <AlertTriangle className="size-5 text-destructive" />
            </span>
            Confirm delete
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <LoadingButton
            variant="destructive"
            onClick={onDelete}
            disabled={isLoading}
            loading={isLoading}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
