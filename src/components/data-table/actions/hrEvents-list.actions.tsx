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
import { useStores } from '@/providers/Store.Provider';

import { EditHrEventsDialogDemo } from '@/app/(portal)/(hr)/hr/manage-events/components/EditHrEventsDialog';
import { ViewHrEvent } from '@/app/(portal)/(hr)/hr/manage-events/components/ViewHrEvent';
import { HrEventsListType } from '@/libs/validations/employee';
import { deleteHrEvent } from '@/services/hr/hrEvents.service';
import { HrEventsStoreType } from '@/stores/hr/hrEvents';

interface DataTableRowActionsProps {
  row: Row<HrEventsListType>;
}

export function HrEventsListRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const data = row.original;
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const { hrEventsStore } = useStores() as {
    hrEventsStore: HrEventsStoreType;
  };
  const { setRefetchHrEventsList } = hrEventsStore;
  const handleViewDetailsOpen = () => {
    setViewDetailsOpen(true);
  };

  const handleViewDetailsClose = () => {
    setViewDetailsOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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
          <DialogTrigger asChild onClick={handleViewDetailsOpen}>
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              View Event
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={handleDialogOpen}>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit Event
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            asChild
            onClick={() => {
              setShowDeleteDialog(true);
            }}
          >
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 size-4" />
              Delete Event
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ViewHrEvent
        event={data}
        onCloseChange={handleViewDetailsClose}
        onOpenChange={handleViewDetailsClose}
        open={viewDetailsOpen}
      />
      <DeleteDialog
        id={data._id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        mutationFunc={deleteHrEvent}
        setRefetch={setRefetchHrEventsList}
      />
      <EditHrEventsDialogDemo
        data={data}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
      />
    </Dialog>
  );
}
