'use client';

import React from 'react';

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

type ModalProps = {
  isOpen: boolean;
  title: string;
  type: string;
  isPending: boolean;
  description: string;
  onSubmit: () => void;
  showActionToggle: (open: boolean) => void;
};

export default function UpdateQuestionDialog({
  isOpen,
  title,
  type,
  description,
  isPending,
  onSubmit,
  showActionToggle,
}: ModalProps) {
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
        <form>
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
              {type === 'enable' && (
                <Button
                  type="button"
                  variant={'default'}
                  onClick={onSubmit}
                  disabled={isPending}
                >
                  {'Enable'}
                </Button>
              )}
              {type === 'disable' && (
                <Button
                  type="button"
                  variant={'destructive'}
                  disabled={isPending}
                  onClick={onSubmit}
                >
                  {'Disable'}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </AlertDialog>
    </>
  );
}
