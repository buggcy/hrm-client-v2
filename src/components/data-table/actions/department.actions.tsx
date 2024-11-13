'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import ConfirmDialog from '@/components/modals/cancel-modal';
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

import ViewDepartment from '@/app/(portal)/(hr)/hr/manage-department/component/Modal/ViewDepartment';
import { DepartmentListType } from '@/libs/validations/project-department';
import { deleteDepartment } from '@/services/hr/project-department.service';
import { ProjectStoreType } from '@/stores/hr/project-department';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<DepartmentListType>;
}

export function DepartmentRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  const { projectStore } = useStores() as { projectStore: ProjectStoreType };
  const { setRefetchProjectList } = projectStore;
  const data = row.original;
  const [isView, setIsView] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] =
    React.useState<DepartmentListType | null>(null);
  const viewToggle = () => {
    setIsView(false);
  };
  const handleView = (row: DepartmentListType) => {
    setSelectedRow(row);
    setIsView(true);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: deleteDepartment,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on deleting department!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchProjectList(true);
      setShowDeleteDialog(false);
    },
  });

  const handleDelete = () => {
    mutate(data?._id);
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
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit Department
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={() => handleView(data)}>
            <Eye className="mr-2 size-4" />
            View Department
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete Department
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Delete'}
        isPending={isPending}
        description={'Are your sure you want to delete this department?'}
        handleDelete={handleDelete}
      />
      <ViewDepartment
        open={isView}
        onCloseChange={viewToggle}
        data={selectedRow}
      />
    </Dialog>
  );
}
