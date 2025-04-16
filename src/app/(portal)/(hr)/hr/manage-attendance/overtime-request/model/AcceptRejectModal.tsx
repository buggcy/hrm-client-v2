'use client';

import React from 'react';

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
import FormattedTextArea from '@/components/ui/FormattedTextArea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { OvertimeListType } from '@/libs/validations/overtime';
import { AcceptRejectOvertime } from '@/services/employee/overtime.service';

import { MessageErrorResponse } from '@/types';

type AcceptRejectProps = {
  isOpen: boolean;
  title: string;
  type: string;
  isPending: boolean;
  description: string;
  onSubmit: () => void;
  showActionToggle: (open: boolean) => void;
  request: OvertimeListType | null;
  hrId?: string;
  setRefetchOvertimeList: (value: boolean) => void;
};
export const FormSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
});

export type RejectFormData = z.infer<typeof FormSchema>;

export default function AcceptOrRejectOvertime({
  isOpen,
  title,
  type,
  description,
  isPending,
  onSubmit,
  showActionToggle,
  request,
  hrId,
  setRefetchOvertimeList,
}: AcceptRejectProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reason: '',
    },
  });

  const { mutate: RejectMutate, isPending: RejectPending } = useMutation({
    mutationFn: AcceptRejectOvertime,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on rejecting overtime!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchOvertimeList(true);
      showActionToggle(false);
    },
  });

  const handleReject = (data: RejectFormData) => {
    const rejectBody = {
      hrId: hrId ?? '',
      rejectionReason: data?.reason,
      status: 'Rejected',
      userId: request?.userId?._id ?? '',
    };
    RejectMutate({ id: request?._id ?? '', body: rejectBody });
  };
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
        <form>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle> {title}</AlertDialogTitle>
              <AlertDialogDescription>
                {type === 'accept' ? (
                  description
                ) : (
                  <>
                    <div className="grid gap-8 py-4">
                      <div className="flex flex-wrap">
                        <div className="flex flex-1 flex-col">
                          <Label
                            htmlFor="reason"
                            className="mb-2 text-left dark:text-white"
                          >
                            Rejection Reason{' '}
                            <span className="text-red-600">*</span>
                          </Label>
                          <Controller
                            name="reason"
                            control={control}
                            render={({ field }) => (
                              <FormattedTextArea
                                value={field.value || ''}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          <div className="flex justify-start p-1">
                            {errors.reason && (
                              <span className="text-sm text-red-500">
                                {errors.reason.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  if (type !== 'accept') {
                    reset();
                  }
                  showActionToggle(false);
                }}
              >
                Close
              </AlertDialogCancel>
              {type === 'accept' ? (
                <Button
                  type="button"
                  variant={'default'}
                  onClick={onSubmit}
                  disabled={isPending}
                >
                  {'Accept'}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant={'destructive'}
                  disabled={RejectPending}
                  onClick={handleSubmit(handleReject)}
                >
                  {'Reject'}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </AlertDialog>
    </>
  );
}
