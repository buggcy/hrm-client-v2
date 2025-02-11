'use client';

import React, { useState } from 'react';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Trash2 } from 'lucide-react';

import DeleteDialog from '@/components/modals/delete-modal';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStores } from '@/providers/Store.Provider';

import { AttendanceRequest } from '@/libs/validations/attendance-request';
import { cancelAttendanceRequest } from '@/services/employee/attendance-request.service';
import { AttendanceRequestStoreType } from '@/stores/employee/attendance-request';

interface DataTableRowActionsProps {
  row: Row<AttendanceRequest>;
}

export function AttendanceRequestRowActions({ row }: DataTableRowActionsProps) {
  const { attendanceRequestStore } = useStores() as {
    attendanceRequestStore: AttendanceRequestStoreType;
  };
  const { setRefetchAttendanceRequestList } = attendanceRequestStore;
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const data = row.original;

  return (
    <Dialog>
      <DropdownMenu>
        {row.original.Status === 'Pending' && (
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-nowrap text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Cancel Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={cancelAttendanceRequest}
        setRefetch={setRefetchAttendanceRequestList}
      />
    </Dialog>
  );
}
