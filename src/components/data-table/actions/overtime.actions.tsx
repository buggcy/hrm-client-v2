'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Pencil, XCircle } from 'lucide-react';

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

import { AddEditOvertime } from '@/app/(portal)/(employee)/employee/attendance/overtime-request/model/ApplyOvertime';
import ViewOvertime from '@/app/(portal)/(employee)/employee/attendance/overtime-request/model/ViewRequest';
import { OvertimeListType } from '@/libs/validations/overtime';
import { updateOvertime } from '@/services/employee/overtime.service';
import { OvertimeStoreType } from '@/stores/employee/overtime';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<OvertimeListType>;
}

export function OvertimeRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [modal, setModal] = React.useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>('');
  const [selectedRow, setSelectedRow] = React.useState<OvertimeListType | null>(
    null,
  );
  const [isView, setIsView] = React.useState<boolean>(false);

  const { overtimeStore } = useStores() as {
    overtimeStore: OvertimeStoreType;
  };
  const { setRefetchOvertimeList } = overtimeStore;

  const data = row.original;

  const viewToggle = () => {
    setIsView(false);
  };
  const handleView = (row: OvertimeListType) => {
    setSelectedRow(row);
    setIsView(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateOvertime,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on cancel overtime!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchOvertimeList(true);
      setShowDeleteDialog(false);
    },
  });
  const handleCancel = () => {
    mutate({ id: data?._id, body: { status: 'Canceled' } });
  };
  const handleEdit = (row: OvertimeListType) => {
    setModalType('edit');
    setModal(true);
    setSelectedRow(row);
  };
  const handleClose = () => {
    setModal(false);
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

          {row?.getValue('status') === 'Pending' ? (
            <>
              <DialogTrigger asChild onClick={() => handleEdit(data)}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 size-4" />
                  Edit Request
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <XCircle className="mr-2 size-4" />
                Cancel Request
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Overtime'}
        isPending={isPending}
        description={'Are your sure you want to cancel this overtime?'}
        type={'cancel'}
        handleDelete={handleCancel}
      />
      <ViewOvertime
        open={isView}
        onCloseChange={viewToggle}
        data={selectedRow}
      />
      <AddEditOvertime
        open={modal}
        onCloseChange={handleClose}
        type={modalType}
        TypeToEdit={selectedRow}
        setRefetchOvertimeList={setRefetchOvertimeList}
      />
    </Dialog>
  );
}
