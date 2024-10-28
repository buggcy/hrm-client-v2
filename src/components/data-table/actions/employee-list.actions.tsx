'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2, UserX } from 'lucide-react';

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

import { FiredModal } from '@/app/(portal)/(hr)/hr/manage-employees/Modal/FiredModal';
import { EmployeeListType } from '@/libs/validations/employee';
import { deleteEmployeeRecord } from '@/services/hr/employee.service';
import { EmployeeStoreType } from '@/stores/hr/employee';
interface DataTableRowActionsProps {
  row: Row<EmployeeListType>;
}

export function EmployeeListRowActions({ row }: DataTableRowActionsProps) {
  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList } = employeeStore;
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  const [modal, setModal] = React.useState<boolean>(false);
  const [firedId, setFiredId] = React.useState<string>('');

  const data = row.original;

  const router = useRouter();
  const handleClose = () => {
    setModal(false);
  };
  const handleEditClick = () => {
    router.push(`/hr/manage-employees/edit-employee?employee=${data._id}`);
  };

  const handleViewDetails = () => {
    router.push(`/profile?userId=${data._id}`);
  };
  const handleFire = (id: string) => {
    setFiredId(id);
    setModal(true);
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
          <DialogTrigger asChild onClick={() => {}}>
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={handleEditClick}>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={() => {}}>
            <DropdownMenuItem onClick={() => handleFire(data?._id)}>
              <UserX className="mr-2 size-4" />
              Fire Employee
            </DropdownMenuItem>
          </DialogTrigger>
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
        mutationFunc={deleteEmployeeRecord}
        setRefetch={setRefetchEmployeeList}
      />
      <FiredModal open={modal} onCloseChange={handleClose} fireId={firedId} />
    </Dialog>
  );
}
