'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { CheckCircle, Eye, MoreHorizontal, Trash2 } from 'lucide-react';

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

import ViewComplaint from '@/app/(portal)/(employee)/employee/complaint/modal/ViewComplaint';
import ResolvedComplaintDialog from '@/app/(portal)/(hr)/hr/manage-complaints/component/ResolvedComplaintModal';
import { ComplaintListType } from '@/libs/validations/complaint';
import { deleteComplaint } from '@/services/employee/complaint.service';
import { useAuthStore } from '@/stores/auth';
import { ComplaintStoreType } from '@/stores/employee/complaint';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<ComplaintListType>;
}

export function HrComplaintRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [modal, setModal] = React.useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] =
    React.useState<ComplaintListType | null>(null);
  const [isView, setIsView] = React.useState<boolean>(false);
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { complaintStore } = useStores() as {
    complaintStore: ComplaintStoreType;
  };
  const { setRefetchComplaintList } = complaintStore;

  const data = row.original;

  const viewToggle = () => {
    setIsView(false);
  };
  const handleView = (row: ComplaintListType) => {
    setSelectedRow(row);
    setIsView(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteComplaint,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on deleting complaint!',
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
  const handleDelete = () => {
    mutate(data?._id);
  };

  const handleClose = () => {
    setModal(false);
  };
  const handleResolved = (row: ComplaintListType) => {
    setSelectedRow(row);
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
          <DropdownMenuItem onClick={() => handleView(data)}>
            <Eye className="mr-2 size-4" />
            View Complaint
          </DropdownMenuItem>

          {row?.getValue('status') === 'Pending' ? (
            <>
              <DropdownMenuItem onClick={() => handleResolved(data)}>
                <CheckCircle className="mr-2 size-4" />
                Resolved Complaint
              </DropdownMenuItem>
            </>
          ) : null}
          {row?.getValue('status') === 'Resolved' ||
          row?.getValue('status') === 'Canceled' ? (
            <DropdownMenuItem
              className="text-red-600"
              onSelect={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 size-4" />
              Delete Complaint
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Complaint'}
        isPending={isPending}
        description={'Are your sure you want to delete this complaint?'}
        handleDelete={handleDelete}
      />
      <ResolvedComplaintDialog
        open={modal}
        onCloseChange={handleClose}
        hrId={userId}
        setRefetchComplaintList={setRefetchComplaintList}
        selectedRow={selectedRow}
      />
      <ViewComplaint
        open={isView}
        onCloseChange={viewToggle}
        data={selectedRow}
      />
    </Dialog>
  );
}
