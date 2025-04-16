'use client';

// * * This is just a demostration of delete modal, actual functionality may vary

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutateFunction } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';

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

import { ResignedListType } from '@/libs/validations/employee';
import {
  ApprovedRejectResignationParams,
  SuccessMessageResponse,
} from '@/services/hr/employee.service';

import {
  FormSchema,
  RejectFormData,
} from '../../manage-attendance/overtime-request/model/AcceptRejectModal';

import { MessageErrorResponse } from '@/types';

type DeleteProps = {
  isOpen: boolean;
  title: string;
  type: string;
  isPending: boolean;
  description: string;
  onSubmit: () => void;
  showActionToggle: (open: boolean) => void;
  request: ResignedListType | null;
  hrId?: string;
  RejectMutate: UseMutateFunction<
    SuccessMessageResponse,
    AxiosError<MessageErrorResponse>,
    ApprovedRejectResignationParams,
    unknown
  >;
  RejectPending: boolean;
};

export default function AcceptRejectResignedDialog({
  isOpen,
  title,
  type,
  description,
  isPending,
  RejectPending,
  onSubmit,
  showActionToggle,
  request,
  hrId,
  RejectMutate,
}: DeleteProps) {
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
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleReject = (data: RejectFormData) => {
    RejectMutate({
      id: request?._id ?? '',
      employeeId: request?.employee?._id ?? '',
      body: {
        hrId: hrId ?? '',
        isApproved: 'Rejected',
        rejectionReason: data?.reason,
      },
    });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
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
                        Rejection Reason <span className="text-red-600">*</span>
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
    </AlertDialog>
  );
}
