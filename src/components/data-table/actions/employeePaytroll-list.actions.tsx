'use client';

import * as React from 'react';

import { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal } from 'lucide-react';

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

import { EmployeePayrollListType } from '@/libs/validations/employee';
import { deleteEmployeeRecord } from '@/services/hr/employee.service';

interface DataTableRowActionsProps {
  row: Row<EmployeePayrollListType>;
}

export function EmployeePayrollListRowActions({
  row,
}: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;

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
          <DialogTrigger asChild onClick={() => {}}>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={deleteEmployeeRecord}
      />
    </Dialog>
  );
}
