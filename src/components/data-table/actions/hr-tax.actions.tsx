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

import { AddEditTax } from '@/app/(portal)/(hr)/hr/manage-configuration/model/AddEditTax';
import { TaxType } from '@/libs/validations/hr-configuration';
import { deleteTax } from '@/services/hr/hrConfiguration.service';
import { useAuthStore } from '@/stores/auth';
import { ConfigurationStoreType } from '@/stores/hr/configuration';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<TaxType>;
}

export function TaxRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const [selectedType, setSelectedType] = React.useState<TaxType | null>(null);

  const { configurationStore } = useStores() as {
    configurationStore: ConfigurationStoreType;
  };
  const { setRefetchConfigurationList } = configurationStore;
  const [modal, setModal] = React.useState<boolean>(false);
  const [modelType, setModelType] = React.useState<string>('');

  const handleClose = () => {
    setModal(false);
  };

  const handleEdit = (type: TaxType) => {
    setModelType('edit');
    setSelectedType(type);
    setModal(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTax,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on delete the tax range!',
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
    const payload = {
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
              Edit Range
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Delete'}
        isPending={isPending}
        description={'Are your sure you want to delete this tax range?'}
        handleDelete={handleDelete}
      />
      {userId && (
        <AddEditTax
          open={modal}
          onCloseChange={handleClose}
          type={modelType}
          userId={userId}
          setRefetchConfigurationList={setRefetchConfigurationList}
          TypeToEdit={selectedType}
        />
      )}
    </Dialog>
  );
}
