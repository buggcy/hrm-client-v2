'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, Mail, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import DeleteDialog from '@/components/modals/delete-modal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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

import { ViewTbaEmployeeDialog } from '@/app/(portal)/(hr)/hr/add-employees/components/ViewTbaEmployeeDialog.component';
import { AddEmployeeDialog } from '@/app/(portal)/(hr)/hr/manage-employees/components/EmployeeModal';
import { EmployeeListType } from '@/libs/validations/employee';
import {
  deleteEmployeeRecord,
  resendEmployeeInvitation,
} from '@/services/hr/employee.service';
import { EmployeeStoreType } from '@/stores/hr/employee';
import { getWritePermissions } from '@/utils/permissions.utils';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<EmployeeListType>;
}

export function UnapprovedEmployeeRowActions({
  row,
}: DataTableRowActionsProps) {
  const writePermission = getWritePermissions('canWriteEmployees');
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList } = employeeStore;

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [tbaDialogOpen, setTbaDialogOpen] = React.useState(false);

  const data = row.original;

  const router = useRouter();

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleTBADialogOpen = () => {
    setTbaDialogOpen(true);
  };

  const handleTBADialogClose = () => {
    setTbaDialogOpen(false);
  };

  const handleEditClick = () => {
    if (data.isApproved === 'tba') {
      handleDialogOpen();
    } else {
      router.push(`/hr/manage-employees/edit-employee?employee=${data._id}`);
    }
  };

  const handleViewDetails = () => {
    if (data.isApproved != 'tba') {
      router.push(`/profile?userId=${data._id}`);
    } else {
      handleTBADialogOpen();
    }
  };

  const { mutate } = useMutation({
    mutationFn: resendEmployeeInvitation,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding employee!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
    },
  });

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
          {writePermission && (
            <DropdownMenuItem onClick={() => mutate(data?._id)}>
              <Mail className="mr-2 size-4" />
              Resend Invitation
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={() => {}}>
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
          {writePermission && (
            <>
              <DialogTrigger asChild onClick={handleEditClick}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 size-4" />
                  Edit Details
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 size-4" />
                Delete Details
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AddEmployeeDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        editData={data}
      />
      <ViewTbaEmployeeDialog
        open={tbaDialogOpen}
        onOpenChange={handleTBADialogClose}
        onCloseChange={handleTBADialogClose}
        data={data}
      />
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={deleteEmployeeRecord}
        setRefetch={setRefetchEmployeeList}
      />
    </Dialog>
  );
}
