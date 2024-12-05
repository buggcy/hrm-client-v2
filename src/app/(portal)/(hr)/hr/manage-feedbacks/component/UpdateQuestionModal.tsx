'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { QuestionAnswerType } from '@/libs/validations/hr-feedback';
import { editQuestion } from '@/services/hr/hr-feedback.service';

import { MessageErrorResponse } from '@/types';

type ModalProps = {
  isOpen: boolean;
  title?: string;
  type: string;
  isPending?: boolean;
  description?: string;
  onSubmit?: () => void;
  showActionToggle: (open: boolean) => void;
  setRefetchFeedbackList: (refetch: boolean) => void;
  selectedRow?: QuestionAnswerType | null;
};
const FormSchema = z.object({
  questionText: z.string().min(1, 'Question is required'),
});

export type FormData = z.infer<typeof FormSchema>;
export default function UpdateQuestionDialog({
  isOpen,
  title,
  type,
  description,
  isPending,
  onSubmit,
  showActionToggle,
  setRefetchFeedbackList,
  selectedRow,
}: ModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questionText: '',
    },
  });

  useEffect(() => {
    if (isOpen && type === 'edit' && selectedRow) {
      setValue('questionText', selectedRow?.questionText || '');
    }
  }, [isOpen, setValue, type, selectedRow]);
  const { mutate, isPending: EditPending } = useMutation({
    mutationFn: editQuestion,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Question Updated Successfully!',
        variant: 'success',
      });

      setRefetchFeedbackList(true);
      showActionToggle(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on updating question!',
        variant: 'error',
      });
    },
  });
  const handleEdit = (data: FormData) => {
    const payload = {
      id: selectedRow?.feedbackId || '',
      questionId: selectedRow?._id || '',
      questionText: data?.questionText,
    };
    mutate(payload);
  };
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
        <form>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {' '}
                {type === 'edit' ? 'Update Question' : title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {type === 'edit' ? (
                  <>
                    <div className="flex flex-wrap">
                      <div className="flex flex-1 flex-col">
                        <Label htmlFor="question" className="mb-2 text-left">
                          Question
                        </Label>
                        <Controller
                          name="questionText"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              id="question"
                              placeholder="Enter Question..."
                              {...field}
                            />
                          )}
                        />
                        {errors.questionText && (
                          <span className="text-sm text-red-500">
                            {errors.questionText.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  description
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  showActionToggle(false);
                }}
              >
                Close
              </AlertDialogCancel>
              {type === 'enable' && (
                <Button
                  type="button"
                  variant={'default'}
                  onClick={onSubmit}
                  disabled={isPending}
                >
                  {'Enable'}
                </Button>
              )}
              {type === 'disable' && (
                <Button
                  type="button"
                  variant={'destructive'}
                  disabled={isPending}
                  onClick={onSubmit}
                >
                  {'Disable'}
                </Button>
              )}
              {type === 'edit' && (
                <Button
                  type="button"
                  onClick={handleSubmit(handleEdit)}
                  variant={'default'}
                  disabled={EditPending}
                >
                  {'Update'}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </AlertDialog>
    </>
  );
}
