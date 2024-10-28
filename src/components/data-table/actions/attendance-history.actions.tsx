'use client';

import React, { useState } from 'react';

import { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal } from 'lucide-react';

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

import AttendanceHistoryDialog from '@/app/(portal)/(employee)/employee/attendance/attendance-history/components/AttendanceHistoryDialog.component';
import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';

interface DataTableRowActionsProps {
  row: Row<AttendanceHistoryListType>;
}

export function AttendanceHistoryRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = useState<React.ReactNode | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const data = row.original;

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
          <DialogTrigger asChild onClick={handleViewDialogOpen}>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View
            </DropdownMenuItem>
          </DialogTrigger>
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
