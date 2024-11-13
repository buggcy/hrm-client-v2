'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle,
} from 'lucide-react';

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

import ActiveInactiveModel from '@/app/(portal)/(hr)/hr/manage-projects/component/Modal/ActiveInactiveModal';
import ViewProject from '@/app/(portal)/(hr)/hr/manage-projects/component/Modal/ViewProject';
import { ProjectListType } from '@/libs/validations/project-department';
import {
  deleteProjects,
  editProject,
} from '@/services/hr/project-department.service';
import { ProjectStoreType } from '@/stores/hr/project-department';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<ProjectListType>;
}

export function ProjectRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const data = row.original;
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [type, setType] = React.useState<string>('');
  const { projectStore } = useStores() as { projectStore: ProjectStoreType };
  const { setRefetchProjectList } = projectStore;
  const [isView, setIsView] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<ProjectListType | null>(
    null,
  );
  const viewToggle = () => {
    setIsView(false);
  };
  const handleView = (row: ProjectListType) => {
    setSelectedRow(row);
    setIsView(true);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: deleteProjects,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on deleting project!',
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
  const handleActive = (row: ProjectListType) => {
    if (row?.isActive) {
      setType('inactive');
    } else {
      setType('active');
    }
    setIsActive(true);
  };
  const toggleActive = () => {
    setIsActive(false);
  };
  const { mutate: ActiveMutate, isPending: ActivePending } = useMutation({
    mutationFn: editProject,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message ||
          'Error on active or dinactive the project!',
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
  const handleSubmit = () => {
    if (type === 'active') {
      const payload = {
        id: data?._id || '',
        body: {
          isActive: true,
        },
      };
      ActiveMutate(payload);
    }
    if (type === 'inactive') {
      const payload = {
        id: data?._id || '',
        body: {
          isActive: false,
        },
      };
      ActiveMutate(payload);
    }
  };
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
              Edit Project
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={() => handleActive(data)}>
            {data?.isActive === true ? (
              <XCircle className="mr-2 size-4" />
            ) : (
              <CheckCircle2 className="mr-2 size-4" />
            )}
            {data?.isActive === true ? 'Inactive' : 'Active'} Project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleView(data)}>
            <Eye className="mr-2 size-4" />
            View Project
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Delete'}
        isPending={isPending}
        description={'Are your sure you want to delete this project?'}
        handleDelete={handleDelete}
      />
      <ActiveInactiveModel
        isOpen={isActive}
        title={`${type === 'active' ? 'Confirm Active' : 'Confirm Inactive'}`}
        type={type}
        description={`${type === 'active' ? 'Are your sure you want to active this project?' : 'Are your sure you want to inactive this project?'}`}
        isPending={ActivePending}
        onSubmit={handleSubmit}
        showActionToggle={toggleActive}
      />
      <ViewProject
        open={isView}
        onCloseChange={viewToggle}
        data={selectedRow}
      />
    </Dialog>
  );
}
