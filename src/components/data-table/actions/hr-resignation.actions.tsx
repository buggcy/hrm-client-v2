'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';

import ConfirmDialog from '@/components/modals/cancel-modal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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

import ViewResignedModal from '@/app/(portal)/(hr)/hr/resigned-employees/components/Modal/ViewResignedModal';
import { ResignedListType } from '@/libs/validations/employee';
import { DeleteResignation } from '@/services/hr/employee.service';
import { EmployeeStoreType } from '@/stores/hr/employee';
import { getWritePermissions } from '@/utils/permissions.utils';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<ResignedListType>;
}

export function ResignationRowActions({ row }: DataTableRowActionsProps) {
  const writePermission = getWritePermissions('canWriteEmployees');
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList } = employeeStore;
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [isView, setIsView] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<ResignedListType | null>(
    null,
  );
  const data = row.original;
  const { mutate, isPending } = useMutation({
    mutationFn: DeleteResignation,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message ||
          'Error on deleting resignation request!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setShowDeleteDialog(false);
      setRefetchEmployeeList(true);
    },
  });

  const handleDelete = () => {
    if (data) {
      const resignationId = data._id || 'defaultId';
      mutate({
        id: resignationId,
      });
    }
  };

  const viewToggle = () => {
    setIsView(false);
  };

  const handleView = (row: ResignedListType) => {
    setSelectedRow(row);
    setIsView(true);
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

          <DropdownMenuItem onClick={() => handleView(data)}>
            <Eye className="mr-2 size-4" />
            View Request
          </DropdownMenuItem>
          {writePermission && (
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 size-4" />
              Delete Request
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Request'}
        isPending={isPending}
        description={
          'Are your sure you want to delete this resignation request?'
        }
        handleDelete={handleDelete}
      />
      <ViewResignedModal
        open={isView}
        onCloseChange={viewToggle}
        data={selectedRow}
      />
    </Dialog>
  );
}
