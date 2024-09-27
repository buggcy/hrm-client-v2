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

import { EmployeeListType } from '@/libs/validations/employee';

type DeleteProps = {
  data: EmployeeListType;
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
};

export default function DeleteDialog({
  data,
  isOpen,
  showActionToggle,
}: DeleteProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You are about to delete Task Details
            of <b>{data.firstName + ' ' + data.lastName}</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              showActionToggle(false);
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
