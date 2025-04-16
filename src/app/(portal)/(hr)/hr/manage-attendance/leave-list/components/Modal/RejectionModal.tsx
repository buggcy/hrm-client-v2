'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
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

type RejectProps = {
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
  id: string;
  hrId?: string;

  RejectMutate: (data: {
    id: string;
    hrId?: string;
    rejectedReason?: string;
  }) => void;
  RejectPending: boolean;
};
const FormSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
});

export type RejectFormData = z.infer<typeof FormSchema>;

export default function RejectRequestModel({
  isOpen,
  showActionToggle,
  id,
  hrId,
  RejectMutate,
  RejectPending,
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
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);
  const handleReject = (data: RejectFormData) => {
    RejectMutate({ id, hrId, rejectedReason: data?.reason });
  };
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
        <form>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Request</AlertDialogTitle>
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
