'use client';

import React, { useState } from 'react';

import { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import { useStores } from '@/providers/Store.Provider';

import { AttendanceDialog } from '@/app/(portal)/(hr)/hr/manage-attendance/attendance-list/components/AttendanceDialog';
import { ViewAttendanceDialog } from '@/app/(portal)/(hr)/hr/manage-attendance/attendance-list/components/ViewAttendanceDialog';
import { AttendanceListType } from '@/libs/validations/attendance-list';
import { deleteAttendance } from '@/services/hr/attendance-list.service';
import { AttendanceListStoreType } from '@/stores/hr/attendance-list';

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
