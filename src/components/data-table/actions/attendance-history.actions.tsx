'use client';

import React, { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, RefreshCw } from 'lucide-react';

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

import AttendanceHistoryDialog from '@/app/(portal)/(employee)/employee/attendance/attendance-history/components/AttendanceHistoryDialog.component';
import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import { refreshAttendance } from '@/services/hr/attendance-list.service';
import { AuthStoreType } from '@/stores/auth';
import { AttendanceHistoryStoreType } from '@/stores/employee/attendance-history';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<AttendanceHistoryListType>;
}

export function AttendanceHistoryRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = useState<React.ReactNode | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const data = row.original;
  const { attendanceHistoryStore } = useStores() as {
    attendanceHistoryStore: AttendanceHistoryStoreType;
  };
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const { setRefetchAttendanceHistoryList } = attendanceHistoryStore;

  const handleViewDialogOpen = () => {
    setShowViewDialog(true);
  };

  const handleViewDialogClose = () => {
    setShowViewDialog(false);
  };

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
      setRefetchAttendanceHistoryList(true);
    },
  });

  const handleRefreshAttendance = () => {
    mutate({
      userIds: [user?.id || ''],
      from: row.original.date.split('T')[0],
      to: row.original.date.split('T')[0],
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
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <AttendanceHistoryDialog
        data={data}
        open={showViewDialog}
        onOpenChange={handleViewDialogClose}
        onCloseChange={handleViewDialogClose}
      />
    </Dialog>
  );
}
