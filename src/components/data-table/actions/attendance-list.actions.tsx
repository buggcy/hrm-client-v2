'use client';

import React, { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Pencil, RefreshCw, Trash2 } from 'lucide-react';

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
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { AttendanceDialog } from '@/app/(portal)/(hr)/hr/manage-attendance/attendance-list/components/AttendanceDialog';
import { ViewAttendanceDialog } from '@/app/(portal)/(hr)/hr/manage-attendance/attendance-list/components/ViewAttendanceDialog';
import { AttendanceListType } from '@/libs/validations/attendance-list';
import {
  deleteAttendance,
  refreshAttendance,
} from '@/services/hr/attendance-list.service';
import { AttendanceListStoreType } from '@/stores/hr/attendance-list';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<AttendanceListType>;
}

export function AttendanceRowActions({ row }: DataTableRowActionsProps) {
  const { attendanceListStore } = useStores() as {
    attendanceListStore: AttendanceListStoreType;
  };
  const { setRefetchAttendanceList } = attendanceListStore;
  const [dialogContent] = useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const data = row.original;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: refreshAttendance,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding attendance!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchAttendanceList(true);
    },
  });

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleViewDialogOpen = () => {
    setShowViewDialog(true);
  };

  const handleViewDialogClose = () => {
    setShowViewDialog(false);
  };

  const handleRefreshAttendance = () => {
    const userIds = [row.original.User_ID];
    const date = row.original.date.split('T')[0];
    mutate({
      userIds,
      from: date,
      to: date,
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
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={handleEditDialogOpen}>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={handleViewDialogOpen}>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={handleRefreshAttendance}>
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={deleteAttendance}
        setRefetch={setRefetchAttendanceList}
      />
      <ViewAttendanceDialog
        data={data}
        open={showViewDialog}
        onOpenChange={handleViewDialogClose}
        onCloseChange={handleViewDialogClose}
      />
      <AttendanceDialog
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
        onCloseChange={handleEditDialogClose}
        type={'edit'}
        data={data}
      />
    </Dialog>
  );
}
