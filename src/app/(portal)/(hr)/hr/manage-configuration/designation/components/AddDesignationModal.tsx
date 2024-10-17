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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useAddDesignation,
  useEditDesignation,
} from '@/hooks/hr/useDesignation.hook';
import { Designation } from '@/libs/validations/hr-designation.validation';
import { AuthStoreType } from '@/stores/auth';

import { MessageErrorResponse } from '@/types';

const addDesignationSchema = z.object({
  designationType: z.string().min(1, 'Designation is required'),
  userId: z.object({
    _id: z.string(),
    companyEmail: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    Avatar: z.string().optional(),
  }),
  isDeleted: z.boolean(),
  status: z.string(),
});

export type AddDesignationFormData = z.infer<typeof addDesignationSchema>;

export interface DesignationDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  mode: 'add' | 'edit';
  designationData?: Designation | undefined;
}

export function AddDesignationDialog({
  open,
  onOpenChange,
  onCloseChange,
  mode,
  designationData,
}: DesignationDialogProps) {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddDesignationFormData>({
    resolver: zodResolver(addDesignationSchema),
    defaultValues: {
      designationType: designationData?.designationType || '',
      userId: {
        _id: user?.id || '',
        companyEmail: user?.companyEmail || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        Avatar: user?.Avatar || undefined,
      },
      isDeleted: designationData?.isDeleted || false,
      status: designationData?.status || 'designation',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('userId', {
        _id: user.id || '',
        companyEmail: user.companyEmail || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        Avatar: user.Avatar || undefined,
      });
    }
  }, [user, setValue]);

  useEffect(() => {
    if (designationData) {
      reset({
        designationType: designationData.designationType || '',
        userId: {
          _id: designationData.userId._id || user?.id || '',
          companyEmail:
            designationData.userId.companyEmail || user?.companyEmail || '',
          firstName: designationData.userId.firstName || user?.firstName || '',
          lastName: designationData.userId.lastName || user?.lastName || '',
          Avatar: designationData.userId.Avatar || user?.Avatar || undefined,
        },
        isDeleted: designationData.isDeleted || false,
        status: designationData.status || 'designation',
      });
    }
  }, [designationData, reset, user]);

  const addDesignation = useAddDesignation();
  const editDesignation = useEditDesignation();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddDesignationFormData) => {
      console.log(
        `${mode === 'add' ? 'Adding' : 'Updating'} designation:`,
        data,
      );
      if (mode === 'add') {
        return await addDesignation.mutateAsync(data);
      } else {
        return await editDesignation.mutateAsync({
          id: designationData?._id as string,
          data,
        });
      }
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error processing designation!',
        variant: 'error',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `${mode === 'add' ? 'Designation added' : 'Designation updated'} successfully`,
      });
      reset();
      onCloseChange();
    },
  });

  const onSubmit = (data: AddDesignationFormData) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Designation' : 'Edit Designation'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="flex flex-col">
            <Label className="mb-4" htmlFor="designationType">
              Designation
            </Label>
            <Controller
              name="designationType"
              control={control}
              render={({ field }) => (
                <Input type="text" placeholder="Enter designation" {...field} />
              )}
            />
            {errors.designationType && (
              <span className="text-sm text-red-500">
                {errors.designationType.message}
              </span>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {mode === 'add' ? 'Add' : 'Update'}{' '}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
