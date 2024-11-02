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
import { Dialog, DialogContent } from '@/components/ui/dialog';
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

import { AddEditFeedbackModal } from '@/app/(portal)/(hr)/hr/manage-feedbacks/component/Modal/AddEditFeedbackModal';
import UpdateQuestionDialog from '@/app/(portal)/(hr)/hr/manage-feedbacks/component/UpdateQuestionModal';
import ViewFeedback from '@/app/(portal)/(hr)/hr/manage-feedbacks/component/ViewFeedbackModal';
import { FeedbackType } from '@/libs/validations/hr-feedback';
import {
  deleteFeedback,
  enableDisableFeedback,
} from '@/services/hr/hr-feedback.service';
import { FeedbackStoreType } from '@/stores/hr/hr-feedback';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<FeedbackType>;
}

export function FeedbackRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const { feedbackStore } = useStores() as { feedbackStore: FeedbackStoreType };
  const { setRefetchFeedbackList } = feedbackStore;

  const [isView, setIsView] = React.useState(false);
  const [isEnable, setIsEnable] = React.useState(false);
  const [type, setType] = React.useState('');
  const [selectedRow, setSelectedRow] = React.useState<FeedbackType | null>(
    null,
  );
  const data = row.original;
  const [modal, setModal] = React.useState(false);
  const [modelType, setModelType] = React.useState('add');

  const handleClose = () => {
    setModal(false);
  };

  const handleEdit = (row: FeedbackType) => {
    setModelType('edit');
    setModal(true);
    setSelectedRow(row);
  };

  const viewToggle = () => {
    setIsView(false);
  };
  const toggleEnable = () => {
    setIsEnable(false);
  };

  const handleView = (row: FeedbackType) => {
    setSelectedRow(row);
    setIsView(true);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: deleteFeedback,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on delete the question!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchFeedbackList(true);
      setShowDeleteDialog(false);
    },
  });
  const handleEnable = (row: FeedbackType) => {
    if (row?.isEnabled) {
      setType('disable');
    } else {
      setType('enable');
    }
    setIsEnable(true);
  };
  const { mutate: EnableMutate, isPending: EnablePending } = useMutation({
    mutationFn: enableDisableFeedback,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message ||
          'Error on enable or disable the feedback records!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchFeedbackList(true);
      setShowDeleteDialog(false);
    },
  });
  const handleSubmit = () => {
    if (type === 'enable') {
      const payload = {
        id: data?._id || '',
        isEnabled: true,
      };
      EnableMutate(payload);
    }
    if (type === 'disable') {
      const payload = {
        id: data?._id || '',
        isEnabled: false,
      };
      EnableMutate(payload);
    }
  };

  const handleDelete = () => {
    const payload = {
      id: data?._id || '',
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
          <DropdownMenuSeparator />{' '}
          <DropdownMenuItem onClick={() => handleEdit(data)}>
            <Pencil className="mr-2 size-4" />
            Update Feedback
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEnable(data)}>
            {data?.isEnabled === true ? (
              <XCircle className="mr-2 size-4" />
            ) : (
              <CheckCircle2 className="mr-2 size-4" />
            )}
            {data?.isEnabled === true ? 'Disable' : 'Enable'} Feedback
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleView(data)}>
            <Eye className="mr-2 size-4" />
            View Questions
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 size-4" />
            Delete Feedback
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Delete'}
        isPending={isPending}
        description={'Are your sure you want to delete this feedback record?'}
        handleDelete={handleDelete}
      />
      <ViewFeedback
        open={isView}
        onCloseChange={viewToggle}
        questionData={selectedRow}
        type="question"
      />
      <UpdateQuestionDialog
        isOpen={isEnable}
        setRefetchFeedbackList={setRefetchFeedbackList}
        title={`${type === 'enable' ? 'Confirm Enable' : 'Confirm Disable'}`}
        type={type}
        description={`${type === 'enable' ? 'Are your sure you want to enable this feedback?' : 'Are your sure you want to disble this feedback?'}`}
        isPending={EnablePending}
        onSubmit={handleSubmit}
        showActionToggle={toggleEnable}
      />
      <AddEditFeedbackModal
        open={modal}
        onCloseChange={handleClose}
        type={modelType}
        selectedRow={selectedRow}
        setRefetchFeedbackList={setRefetchFeedbackList}
      />
    </Dialog>
  );
}
