'use client';

// * * This is just a demostration of delete modal, actual functionality may vary

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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

import { SuccessMessageResponse } from '@/services/hr/employee.service';

import { toast } from '../ui/use-toast';

import { MessageErrorResponse } from '@/types';

type DeleteProps = {
  id: string;
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
  mutationFunc: (id: string) => Promise<SuccessMessageResponse>;
  setRefetch: (refetch: boolean) => void;
  reset?: () => void;
};

export default function DeleteDialog({
  id,
  isOpen,
  showActionToggle,
  mutationFunc,
  setRefetch,
  reset,
}: DeleteProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: mutationFunc,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on deleting record!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetch(true);
      reset?.();
      showActionToggle(false);
    },
  });

  const handleDelete = () => {
    if (id) {
      mutate(id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You are about to delete this record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              showActionToggle(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
