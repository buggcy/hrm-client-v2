'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Pencil, XCircle } from 'lucide-react';

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

import { AddEditComplaintModal } from '@/app/(portal)/(employee)/employee/complaint/modal/AddEditComplaintModal';
import ViewComplaint from '@/app/(portal)/(employee)/employee/complaint/modal/ViewComplaint';
import { ComplaintListType } from '@/libs/validations/complaint';
import { cancelComplaint } from '@/services/employee/complaint.service';
import { ComplaintStoreType } from '@/stores/employee/complaint';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<ComplaintListType>;
}

export function ComplaintRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [modal, setModal] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>('');
  const [selectedRow, setSelectedRow] =
    React.useState<ComplaintListType | null>(null);
  const [isView, setIsView] = React.useState<boolean>(false);
  const { complaintStore } = useStores() as {
    complaintStore: ComplaintStoreType;
  };
  const { setRefetchComplaintList } = complaintStore;

  const data = row.original;

  const handleClose = () => {
    setModal(false);
  };

  const viewToggle = () => {
    setIsView(false);
  };
  const handleView = (row: ComplaintListType) => {
    setSelectedRow(row);
    setIsView(true);
  };
  const handleEdit = (row: ComplaintListType) => {
    setModalType('edit');
    setModal(true);
    setSelectedRow(row);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: cancelComplaint,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on cancel complaint!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchComplaintList(true);
      setShowDeleteDialog(false);
    },
  });
  const handleCancel = () => {
    mutate(data?._id);
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
            View Complaint
          </DropdownMenuItem>
          {row?.getValue('status') === 'Pending' ? (
            <>
              <DropdownMenuItem onClick={() => handleEdit(data)}>
                <Pencil className="mr-2 size-4" />
                Edit Complaint
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <XCircle className="mr-2 size-4" />
                Cancel Complaint
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <AddEditComplaintModal
        open={modal}
        onCloseChange={handleClose}
        type={modalType}
        selectedRow={selectedRow}
        setRefetchComplaintList={setRefetchComplaintList}
      />
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Complaint'}
        isPending={isPending}
        description={'Are your sure you want to cancel this complaint?'}
        type={'cancel'}
        handleDelete={handleCancel}
      />
      <ViewComplaint
        open={isView}
        onCloseChange={viewToggle}
        data={selectedRow}
      />
    </Dialog>
  );
}
