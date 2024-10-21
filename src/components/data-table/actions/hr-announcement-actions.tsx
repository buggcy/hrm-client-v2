'use client';

import * as React from 'react';

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

import { AnnouncementDetailsDialog } from '@/app/(portal)/(hr)/hr/manage-announcement/components/AnnouncementDetails';
import { AnnouncementDialog } from '@/app/(portal)/(hr)/hr/manage-announcement/components/AnnouncementDialog';
import {
  useAnnouncementsQuery,
  useDeleteAnnouncementMutation,
} from '@/hooks/hr/useManageAnnouncement';
import { AnnouncementType } from '@/libs/validations/hr-announcement';

interface DataTableRowActionsProps {
  row: Row<AnnouncementType>;
}

export function HrAnnouncementRowActions({ row }: DataTableRowActionsProps) {
  const { refetch } = useAnnouncementsQuery();
  const { mutateAsync } = useDeleteAnnouncementMutation();
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [announcementDetails, setAnnouncementDetails] =
    React.useState<AnnouncementType | null>(null);

  const [detailsDialogOpen, setDetailsDialogOpen] =
    React.useState<boolean>(false);

  const [announcementData, setAnnouncementData] =
    React.useState<AnnouncementType | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;

  const handleEditClick = () => {
    setAnnouncementData(data);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAnnouncementData(null);
  };

  const handleDelete = async () => {
    await mutateAsync(data._id);
    await refetch();
    setShowDeleteDialog(false);
  };
  const handleDetailsClick = () => {
    setDetailsDialogOpen(true);
    setAnnouncementDetails(data);
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
          <DialogTrigger asChild onClick={handleDetailsClick}>
            <DropdownMenuItem>
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
        mutationFunc={mutateAsync}
        setRefetch={handleDelete}
      />
      <AnnouncementDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={() => setDetailsDialogOpen(false)}
        announcementData={announcementDetails}
      />

      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        mode="edit"
        announcementData={announcementData}
      />
    </Dialog>
  );
}
