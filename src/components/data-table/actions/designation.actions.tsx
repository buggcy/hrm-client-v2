'use client';

import * as React from 'react';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import DeleteDialog from '@/components/modals/delete-modal';
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

import { AddDesignationDialog } from '@/app/(portal)/(hr)/hr/manage-configuration/designation/components/AddDesignationModal';
import { useDeleteDesignation } from '@/hooks/hr/useDesignation.hook';
import { Designation } from '@/libs/validations/hr-designation.validation';
interface DataTableRowActionsProps {
  row: Row<Designation>;
}

export function DesignationAction({ row }: DataTableRowActionsProps) {
  const deleteDesignationMutation = useDeleteDesignation();

  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = React.useState<boolean>(false);
  const [designationData, setDesignationData] =
    React.useState<Designation | null>(null);
  const data = row.original;
  const setRefetch = (value: boolean) => {
    return value;
  };

  const handleDialogClose = () => {
    setShowEditDialog(false);
    setDesignationData(null);
  };

  const handleEditClick = () => {
    setDesignationData(data);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string): Promise<{ message: string }> => {
    return deleteDesignationMutation.mutateAsync({
      id,
      status: data.status || 'designation',
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
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleEditClick}>
            <Pencil className="mr-2 size-4" />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={handleDelete}
        setRefetch={setRefetch}
      />
      <AddDesignationDialog
        open={showEditDialog}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        mode="edit"
        designationData={designationData || undefined}
      />
    </Dialog>
  );
}
