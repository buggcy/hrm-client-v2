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

import { ApplyLeaveDialog } from '@/app/(portal)/(employee)/employee/attendance/leave-history/components/ApplyLeaveDialog';
import { ViewLeaveHistoryDialog } from '@/app/(portal)/(employee)/employee/attendance/leave-history/components/ViewLeaveDialog';
import { LeaveHistoryListType } from '@/libs/validations/leave-history';
import { cancelLeaveRequest } from '@/services/employee/leave-history.service';
import { LeaveHistoryStoreType } from '@/stores/employee/leave-history';

interface DataTableRowActionsProps {
  row: Row<LeaveHistoryListType>;
}

export function LeaveHistoryRowActions({ row }: DataTableRowActionsProps) {
  const { leaveHistoryStore } = useStores() as {
    leaveHistoryStore: LeaveHistoryStoreType;
  };
  const { setRefetchLeaveHistoryList } = leaveHistoryStore;
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
          {row.original.Status === 'Pending' && (
            <DialogTrigger asChild onClick={handleEditDialogOpen}>
              <DropdownMenuItem>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
          )}
          <DialogTrigger asChild onClick={handleViewDialogOpen}>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View
            </DropdownMenuItem>
          </DialogTrigger>
          {row.original.Status === 'Pending' && (
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 size-4" />
              Cancel
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={cancelLeaveRequest}
        setRefetch={setRefetchLeaveHistoryList}
      />
      <ViewLeaveHistoryDialog
        data={data}
        open={showViewDialog}
        onOpenChange={handleViewDialogClose}
        onCloseChange={handleViewDialogClose}
      />
      <ApplyLeaveDialog
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
        onCloseChange={handleEditDialogClose}
        data={data}
        id={data._id}
      />
    </Dialog>
  );
}
