'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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

import { AddExtraLeaveModal } from '@/app/(portal)/(hr)/hr/manage-leave/component/AddExtraLeave';
import { ExtraLeaveType } from '@/libs/validations/manage-leave';
import { DeleteExtraLeave } from '@/services/hr/manage.leave.service';
import { ManageLeaveStoreType } from '@/stores/hr/leave';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<ExtraLeaveType>;
}

export function ManageLeaveRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;
  const [modal, setModal] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>('');
  const [selectedLeave, setSelectedLeave] =
    React.useState<ExtraLeaveType | null>(null);
  const { manageLeaveStore } = useStores() as {
    manageLeaveStore: ManageLeaveStoreType;
  };
  const { setRefetchManageLeaveList } = manageLeaveStore;

  const { mutate, isPending } = useMutation({
    mutationFn: DeleteExtraLeave,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on cancel request!',
        variant: 'destructive',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
      });
      setRefetchManageLeaveList(true);
      setShowDeleteDialog(false);
    },
  });

  const handleDelete = () => {
    if (data) {
      const userId = data.userId || 'defaultId';
      mutate({
        id: userId,
        leaveId: data._id,
      });
    }
  };
  const handleClose = () => {
    setModal(false);
  };
  const handleEdit = (leave: ExtraLeaveType) => {
    setSelectedLeave(leave);
    setModalType('edit');
    setModal(true);
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
          <DialogTrigger asChild onClick={() => handleEdit(data)}>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit Leave
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            className="text-red-600"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete Leave
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Request'}
        isPending={isPending}
        description={'Are your sure you want to delete this leave?'}
        handleDelete={handleDelete}
      />
      <AddExtraLeaveModal
        open={modal}
        onCloseChange={handleClose}
        selectedEmployeeId={data?.userId ?? ''}
        type={modalType}
        setRefetchManageLeaveList={setRefetchManageLeaveList}
        leaveToEdit={modalType === 'edit' ? selectedLeave : null}
      />
    </Dialog>
  );
}
