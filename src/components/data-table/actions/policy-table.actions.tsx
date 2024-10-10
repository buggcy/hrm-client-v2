'use client';

import * as React from 'react';

import { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';

import DeleteDialog from '@/components/modals/delete-modal';
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

import { useDeletePolicy } from '@/hooks/usepolicyQuery';
import { PolicyType } from '@/libs/validations/hr-policy';

interface DataTableRowActionsProps {
  row: Row<PolicyType>;
}

export function PolicyListRowActions({ row }: DataTableRowActionsProps) {
  const { mutateAsync } = useDeletePolicy();

  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;

  const handleViewDetails = () => {
    const fileUrl = data.file;
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      console.error('File URL is not available');
    }
  };

  const handleDelete = (id: string): Promise<{ message: string }> => {
    return new Promise((resolve, reject) => {
      void mutateAsync(id, {
        onSuccess: data => {
          resolve(data);
        },
        onError: error => {
          reject(error);
        },
      });
    });
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
          <DialogTrigger asChild onClick={() => {}}>
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye className="mr-2 size-4" />
              View Policy
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={handleDelete}
      />
    </Dialog>
  );
}
