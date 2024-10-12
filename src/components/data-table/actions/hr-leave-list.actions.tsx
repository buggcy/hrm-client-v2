'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Check, Eye, MoreHorizontal, Trash2, XCircle } from 'lucide-react';

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

import AcceptRejectLeaveDialog from '@/app/(portal)/(hr)/hr/manage-attendance/leave-list/components/Modal/AcceptRejectLeaveModal';
import ViewLeaveList from '@/app/(portal)/(hr)/hr/manage-attendance/leave-list/components/Modal/ViewLeaveModal';
import { LeaveListType } from '@/libs/validations/hr-leave-list';
import {
  acceptLeaveRecord,
  deleteLeaveRecord,
} from '@/services/hr/leave-list.service';
import { useAuthStore } from '@/stores/auth';
import { LeaveListStoreType } from '@/stores/hr/leave-list';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<LeaveListType>;
}

export function LeaveListRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [showAcceptDialog, setShowAcceptDialog] =
    React.useState<boolean>(false);
  const [type, setType] = React.useState<string>('');
  const [isView, setIsView] = React.useState(false);
  const [selectedLeave, setSelectedLeave] =
    React.useState<LeaveListType | null>(null);
  const data = row.original;
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { leaveListStore } = useStores() as {
    leaveListStore: LeaveListStoreType;
  };
  const { setRefetchLeaveList } = leaveListStore;

  const viewToggle = () => {
    setIsView(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteLeaveRecord,
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
      setRefetchLeaveList(true);
      setShowDeleteDialog(false);
    },
  });

  const { mutate: AcceptMutate, isPending: AcceptPending } = useMutation({
    mutationFn: ({ id, hrId }: { id: string; hrId: string | undefined }) =>
      acceptLeaveRecord(id, hrId!),
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on approval request!',
        variant: 'destructive',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
      });
      setRefetchLeaveList(true);
      setShowAcceptDialog(false);
    },
  });

  const handleView = (leave: LeaveListType) => {
    setSelectedLeave(leave);
    setIsView(true);
  };

  const handleDelete = () => {
    mutate(data?._id);
  };

  const handleAccept = () => {
    const hrId = userId;
    AcceptMutate({ id: data?._id, hrId });
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
          <DropdownMenuSeparator />{' '}
          {row?.getValue('Status') === 'Pending' ? (
            <>
              <DropdownMenuItem onClick={() => handleView(data)}>
                <Eye className="mr-2 size-4" />
                View Request
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setType('accept');
                  setShowAcceptDialog(true);
                }}
              >
                <Check className="mr-2 size-4" />
                Accept Request
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setType('reject');
                  setShowAcceptDialog(true);
                }}
              >
                <XCircle className="mr-2 size-4" />
                Reject Request
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete Request
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => handleView(data)}>
                <Eye className="mr-2 size-4" />
                View Request
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete Request
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Request'}
        isPending={isPending}
        description={'Are your sure you want to delete this leave request?'}
        handleDelete={handleDelete}
      />

      <AcceptRejectLeaveDialog
        type={type}
        isOpen={showAcceptDialog}
        showActionToggle={setShowAcceptDialog}
        title={
          type === 'accept' ? 'Accept Leave Request' : 'Reject Leave Request'
        }
        isPending={AcceptPending}
        description={
          type === 'accept'
            ? 'Are you sure you want to accept this leave request?'
            : ''
        }
        onSubmit={handleAccept}
        id={data?._id}
        hrId={userId}
        setRefetchLeaveList={setRefetchLeaveList}
      />
      <ViewLeaveList
        open={isView}
        onCloseChange={viewToggle}
        data={selectedLeave}
      />
    </Dialog>
  );
}
