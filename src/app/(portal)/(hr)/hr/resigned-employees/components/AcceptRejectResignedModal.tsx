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
  handleDelete: () => void;
  showActionToggle: (open: boolean) => void;
  type: string;
};

export default function AcceptRejectDialog({
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
            variant={type === 'accept' ? 'default' : 'destructive'}
            onClick={handleDelete}
            disabled={isPending}
          >
            {type === 'accept' ? 'Approved' : 'Rejected'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
