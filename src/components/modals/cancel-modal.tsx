'use client';

// * * This is just a demostration of delete modal, actual functionality may vary

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type DeleteProps = {
  isOpen: boolean;
  title: string;
  isPending: boolean;
  description: string;
  type?: string;
  handleDelete: () => void;
  showActionToggle: (open: boolean) => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  isPending,
  handleDelete,
  showActionToggle,
  type,
}: DeleteProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> {title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              showActionToggle(false);
            }}
          >
            Close
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {type === 'cancel' ? 'Cancel' : ' Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
