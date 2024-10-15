'use client';

import { useState } from 'react';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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

import { AddPerksDialog } from '@/app/(portal)/(hr)/hr/manage-perks/add-perks/components/AddPerksDialog';
import { HrPerksListType } from '@/libs/validations/hr-perks';
import { deletePerk } from '@/services/hr/perks-list.service';
import { PerkListStoreType } from '@/stores/hr/perk-list';
interface DataTableRowActionsProps {
  row: Row<HrPerksListType>;
}

export function HrPerkListRowActions({ row }: DataTableRowActionsProps) {
  const { perkListStore } = useStores() as { perkListStore: PerkListStoreType };
  const { setRefetchPerkList } = perkListStore;
  const [dialogContent] = useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const data = row.original;

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
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
          <DialogTrigger asChild onClick={handleEditDialogOpen}>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit Perk
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Perk
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={deletePerk}
        setRefetch={setRefetchPerkList}
      />
      <AddPerksDialog
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
        onCloseChange={handleEditDialogClose}
        type="edit"
        editData={data}
      />
    </Dialog>
  );
}
