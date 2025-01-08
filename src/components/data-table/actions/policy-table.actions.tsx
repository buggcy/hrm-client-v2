'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';

import ConfirmDialog from '@/components/modals/cancel-modal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { PolicyListType } from '@/libs/validations/hr-policy';
import { deletePolicy } from '@/services/hr/policies.service';
import { PolicyStoreType } from '@/stores/hr/policy';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<PolicyListType>;
}

export function PolicyListRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const data = row.original;
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const { policiesStore } = useStores() as { policiesStore: PolicyStoreType };
  const { setRefetchPolicyList } = policiesStore;

  const { mutate, isPending } = useMutation({
    mutationFn: deletePolicy,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on deleting policy!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchPolicyList(true);
      setShowDeleteDialog(false);
    },
  });
  const handleDelete = () => {
    mutate({ id: data?._id });
  };
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger
            asChild
            onClick={() => window.open(String(data?.file), '_blank')}
          >
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View Policy
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Policy
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Delete'}
        isPending={isPending}
        description={'Are your sure you want to delete this policy?'}
        handleDelete={handleDelete}
      />
    </Dialog>
  );
}
