'use client';

import React, { useState } from 'react';

import { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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

import { AnnouncementDialog } from '@/app/(portal)/(hr)/hr/manage-announcements/components/AddAnnouncementDialog.component';
import { ViewAnnouncement } from '@/app/(portal)/(hr)/hr/manage-announcements/components/ViewAnnouncementDialog.component';
import { AnnouncementType } from '@/libs/validations/hr-announcements';
import { deleteAnnouncement } from '@/services/hr/manage-announcements.service';
import { AnnouncementsStoreType } from '@/stores/hr/announcements';

interface DataTableRowActionsProps {
  row: Row<AnnouncementType>;
}

export function ManageAnnouncementRowActions({
  row,
}: DataTableRowActionsProps) {
  const { manageAnnouncementsStore } = useStores() as {
    manageAnnouncementsStore: AnnouncementsStoreType;
  };
  const { setRefetchAnnouncements } = manageAnnouncementsStore;
  const [dialogContent] = useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const data = row.original;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

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
          <DialogTrigger asChild onClick={handleEditDialogOpen}>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={handleViewDialogOpen}>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={deleteAnnouncement}
        setRefetch={setRefetchAnnouncements}
      />
      <ViewAnnouncement
        announcement={data}
        onCloseChange={handleViewDialogClose}
        open={showViewDialog}
        onOpenChange={handleViewDialogClose}
      />
      <AnnouncementDialog
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
        onCloseChange={handleEditDialogClose}
        data={data}
      />
    </Dialog>
  );
}
