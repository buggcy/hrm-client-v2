'use client';

import React from 'react';

import { TriangleAlert } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

import { useDeleteApiKeyMutation } from '@/hooks/useApiKeys';
import { queryClient } from '@/libs';

import { IApiKey } from '@/types';

export function DeleteApiKeyDialog({
  id,
  onClose,
}: {
  id: IApiKey['key_prefix'] | null;
  onClose: () => void;
}) {
  const { mutate: deleteApiKey, isPending } = useDeleteApiKeyMutation({
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ['api-keys'] });
      toast({
        title: 'API key deleted',
        variant: 'success',
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Failed to delete API key',
        variant: 'error',
      });
    },
  });

  const onSubmit = () => {
    if (id) {
      deleteApiKey(id);
    }
  };

  return (
    <Dialog open={!!id} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <div className="flex items-center space-x-2">
          <TriangleAlert className="size-5 text-destructive" />
          <DialogTitle className="text-lg font-semibold">
            Confirm Delete
          </DialogTitle>
        </div>
        <div>
          <DialogDescription className="mt-2 text-sm text-muted-foreground">
            You will no longer be able to access this API Key.
          </DialogDescription>
          <div className="mt-4 flex justify-end space-x-2">
            <div>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
            </div>
            <LoadingButton
              variant="destructive"
              onClick={onSubmit}
              loading={isPending}
              disabled={isPending}
            >
              Delete API Key
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
