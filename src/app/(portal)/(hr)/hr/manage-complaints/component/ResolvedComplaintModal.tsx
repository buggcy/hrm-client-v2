'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { ComplaintListType } from '@/libs/validations/complaint';
import { resolvedComplaint } from '@/services/employee/complaint.service';

import { MessageErrorResponse } from '@/types';

type Props = {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  hrId?: string;
  selectedRow?: ComplaintListType | null;
  setRefetchComplaintList: (value: boolean) => void;
};
const FormSchema = z.object({
  message: z.string().min(1, 'Complaint Feedback is required'),
});

export type ResolvedFormData = z.infer<typeof FormSchema>;

export default function ResolvedComplaintDialog({
  open,
  onCloseChange,
  hrId,
  selectedRow,
  setRefetchComplaintList,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResolvedFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  });
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
  const { mutate, isPending } = useMutation({
    mutationFn: resolvedComplaint,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on resolving complaint!',
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
      setRefetchComplaintList(true);
      onCloseChange(false);
    },
  });

  const onSubmit = (data: ResolvedFormData) => {
    const payload = {
      id: selectedRow?._id || '',
      employeeId: selectedRow?.employee?._id || '',
      body: {
        hrId: hrId || '',
        message: data?.message,
      },
    };
    mutate(payload);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'Resolved Complaint'}</DialogTitle>
          </DialogHeader>
          <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-8 py-4">
              <div className="flex flex-wrap">
                <div className="flex flex-1 flex-col">
                  <Label
                    htmlFor="message"
                    className="mb-2 text-left dark:text-white"
                  >
                    Complaint Feedback <span className="text-red-600">*</span>
                  </Label>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="message"
                        placeholder={'Please Enter complaint feedback'}
                        {...field}
                      />
                    )}
                  />
                  <div className="flex justify-start p-1">
                    {errors.message && (
                      <span className="text-sm text-red-500">
                        {errors.message.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending} size={'sm'}>
                {'Resolved'}
              </Button>
              <Button
                variant="ghostSecondary"
                type="button"
                onClick={() => {
                  onCloseChange(false);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
