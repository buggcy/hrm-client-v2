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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { rejectLeaveRecord } from '@/services/hr/leave-list.service';

import { MessageErrorResponse } from '@/types';

type RejectProps = {
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
  id: string;
  hrId?: string;
  setRefetchLeaveList: (value: boolean) => void;
};
const FormSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
});

export type RejectFormData = z.infer<typeof FormSchema>;

export default function RejectLeaveDialog({
  isOpen,
  showActionToggle,
  id,
  hrId,
  setRefetchLeaveList,
}: RejectProps) {
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
    mutationFn: ({
      id,
      hrId,
      rejectedReason,
    }: {
      id: string;
      hrId: string | undefined;
      rejectedReason: string;
    }) => rejectLeaveRecord(id, hrId!, rejectedReason),
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on approval request!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      reset();
      setRefetchLeaveList(true);
      showActionToggle(false);
    },
  });
  const handleReject = (data: RejectFormData) => {
    RejectMutate({ id, hrId, rejectedReason: data?.reason });
  };
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
        <form>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Leave Request</AlertDialogTitle>
              <AlertDialogDescription>
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
                          <Input
                            type="text"
                            id="reason"
                            placeholder={'Please Enter Rejection Reason'}
                            {...field}
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
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  reset();
                  showActionToggle(false);
                }}
              >
                Close
              </AlertDialogCancel>
              <Button
                type="button"
                variant="destructive"
                disabled={RejectPending}
                onClick={handleSubmit(handleReject)}
              >
                Reject
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </AlertDialog>
    </>
  );
}
