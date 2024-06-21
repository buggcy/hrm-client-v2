'use client';

import React from 'react';

import { TriangleAlert } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Failed to delete API key',
        variant: 'destructive',
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
        <div>
          <div className="flex items-center space-x-2">
            <TriangleAlert className="size-5 text-destructive" />
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
          </div>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </p>
          </div>
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
