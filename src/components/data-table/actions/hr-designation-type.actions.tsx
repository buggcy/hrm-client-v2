'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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

import { AddEditTypeDialog } from '@/app/(portal)/(hr)/hr/manage-configuration/component/AddEditTypeModal';
import { ConfigurationType } from '@/libs/validations/hr-configuration';
import { deleteType } from '@/services/hr/hrConfiguration.service';
import { useAuthStore } from '@/stores/auth';
import { ConfigurationStoreType } from '@/stores/hr/configuration';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<ConfigurationType>;
}

export function DesignationTypeRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const [selectedType, setSelectedType] =
    React.useState<ConfigurationType | null>(null);

  const { configurationStore } = useStores() as {
    configurationStore: ConfigurationStoreType;
  };
  const { setRefetchConfigurationList } = configurationStore;
  const [modal, setModal] = React.useState<boolean>(false);
  const [modelType, setModelType] = React.useState<string>('');

  const handleClose = () => {
    setModal(false);
  };

  const handleEdit = (type: ConfigurationType) => {
    setModelType('edit');
    setSelectedType(type);
    setModal(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteType,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message ||
          'Error on delete the designation type!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchConfigurationList(true);
      setShowDeleteDialog(false);
    },
  });
  const handleDelete = () => {
    const status = 'designation';
    const payload = {
      status: status,
      id: data?._id,
    };

    mutate(payload);
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
          <DialogTrigger asChild onClick={() => handleEdit(data)}>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit Type
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Type
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Delete'}
        isPending={isPending}
        description={'Are your sure you want to delete this designation type?'}
        handleDelete={handleDelete}
      />
      {userId && (
        <AddEditTypeDialog
          open={modal}
          onCloseChange={handleClose}
          type={modelType}
          userId={userId}
          setRefetchConfigurationList={setRefetchConfigurationList}
          TypeToEdit={modelType === 'edit' ? selectedType : null}
          moduleType={'Designation'}
        />
      )}
    </Dialog>
  );
}
