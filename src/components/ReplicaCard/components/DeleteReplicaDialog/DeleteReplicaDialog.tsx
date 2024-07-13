'use client';

import React from 'react';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { TriangleAlert } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

import { useDeleteReplicaMutation } from '@/hooks';
import { queryClient } from '@/libs';

import { IReplica } from '@/types';

export function DeleteReplicaDialog({ id }: { id: IReplica['replica_id'] }) {
  const [open, setOpen] = React.useState(false);

  const { mutate: deleteReplica, isPending } = useDeleteReplicaMutation({
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ['replicas'] });
      toast({
        title: 'Replica deleted',
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Failed to delete replica',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = () => {
    if (id) {
      deleteReplica(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Here</DialogTrigger>
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
              <Button variant="outline">Cancel</Button>
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
