'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Pencil, XCircle } from 'lucide-react';

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

import { EditPerkModal } from '@/app/(portal)/(employee)/employee/perks/component/EditPerkModal';
import ViewPerk from '@/app/(portal)/(employee)/employee/perks/component/ViewPerk';
import { useAllPerkQuery } from '@/hooks/employee/usePerkList.hook';
import { TransformedPerkData } from '@/libs/validations/perk';
import { unAvailPerk } from '@/services/employee/perk.service';
import { useAuthStore } from '@/stores/auth';
import { PerkStoreType } from '@/stores/employee/perks';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<TransformedPerkData>;
}

export function PerkListRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [modal, setModal] = React.useState(false);
  const [isView, setIsView] = React.useState(false);
  const [modelType, setModelType] = React.useState('');
  const [selectedPerk, setSelectedPerk] =
    React.useState<TransformedPerkData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;
  const { user } = useAuthStore();
  const userId: string | undefined = user?.id;
  const { perkStore } = useStores() as { perkStore: PerkStoreType };
  const { setRefetchPerkList } = perkStore;
  const { refetch } = useAllPerkQuery(userId as string, {
    enabled: !!userId,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: unAvailPerk,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on cancel request!',
        variant: 'error',
      });
    },
    onSuccess: async response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchPerkList(true);
      await refetch();
      setShowDeleteDialog(false);
    },
  });
  const handleDelete = () => {
    if (userId && data?.id) {
      const payload = {
        employeeId: userId,
        perkId: data.id,
        applicationId: data.requestId,
      };

      mutate(payload);
    }
  };
  const handleClose = () => {
    setModal(false);
  };
  const viewToggle = () => {
    setIsView(false);
  };
  const handleEdit = (perk: TransformedPerkData) => {
    setSelectedPerk(perk);
    setModelType('edit');
    setModal(true);
  };

  const handleView = (perk: TransformedPerkData) => {
    setSelectedPerk(perk);
    setIsView(true);
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
          {row?.getValue('hrApproval') === 'pending' ? (
            <>
              {' '}
              <DropdownMenuItem onClick={() => handleView(data)}>
                <Eye className="mr-2 size-4" />
                View Request
              </DropdownMenuItem>
              <DialogTrigger asChild onClick={() => handleEdit(data)}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 size-4" />
                  Edit Request
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <XCircle className="mr-2 size-4" />
                Cancel Request
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {' '}
              <DropdownMenuItem onClick={() => handleView(data)}>
                <Eye className="mr-2 size-4" />
                View Request
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Request'}
        isPending={isPending}
        description={'Are your sure you want to cancel this request?'}
        handleDelete={handleDelete}
      />
      {user && (
        <EditPerkModal
          open={modal}
          onCloseChange={handleClose}
          user={user}
          perkToEdit={modelType === 'edit' ? selectedPerk : null}
        />
      )}
      <ViewPerk
        open={isView}
        onCloseChange={viewToggle}
        viewData={selectedPerk}
      />
    </Dialog>
  );
}
