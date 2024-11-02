'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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

import UpdateQuestionDialog from '@/app/(portal)/(hr)/hr/manage-feedbacks/component/UpdateQuestionModal';
import ViewFeedback from '@/app/(portal)/(hr)/hr/manage-feedbacks/component/ViewFeedbackModal';
import { QuestionAnswerType } from '@/libs/validations/hr-feedback';
import { deleteQuestion } from '@/services/hr/hr-feedback.service';
import { FeedbackStoreType } from '@/stores/hr/hr-feedback';

import { MessageErrorResponse } from '@/types';

interface DataTableRowActionsProps {
  row: Row<QuestionAnswerType>;
}

export function QuestionAnswerRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [isView, setIsView] = React.useState(false);
  const [selectedRow, setSelectedRow] =
    React.useState<QuestionAnswerType | null>(null);
  const [isEdit, setIsEdit] = React.useState(false);
  const [type, setType] = React.useState('');
  const data = row.original;
  const { feedbackStore } = useStores() as { feedbackStore: FeedbackStoreType };
  const { setRefetchFeedbackList } = feedbackStore;

  const viewToggle = () => {
    setIsView(false);
  };
  const toggleEdit = () => {
    setIsEdit(false);
  };
  const handleEdit = (row: QuestionAnswerType) => {
    setType('edit');
    setIsEdit(true);
    setSelectedRow(row);
  };

  const handleView = (row: QuestionAnswerType) => {
    setSelectedRow(row);
    setIsView(true);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: deleteQuestion,
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
  const handleDelete = () => {
    const payload = {
      questionId: data?._id || '',
      id: data?.feedbackId || '',
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
          {data?.isEnabled === false && (
            <DropdownMenuItem onClick={() => handleEdit(data)}>
              <Pencil className="mr-2 size-4" />
              Edit Question
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleView(data)}>
            <Eye className="mr-2 size-4" />
            View Answers
          </DropdownMenuItem>
          {data?.isEnabled === false && (
            <DropdownMenuItem
              className="text-red-600"
              onSelect={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 size-4" />
              Delete Question
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
        title={'Confirm Delete'}
        isPending={isPending}
        description={'Are your sure you want to delete this question?'}
        handleDelete={handleDelete}
      />

      <ViewFeedback
        open={isView}
        onCloseChange={viewToggle}
        answerData={selectedRow}
        type={'answer'}
      />
      <UpdateQuestionDialog
        isOpen={isEdit}
        type={type}
        showActionToggle={toggleEdit}
        selectedRow={selectedRow}
        setRefetchFeedbackList={setRefetchFeedbackList}
      />
    </Dialog>
  );
}
