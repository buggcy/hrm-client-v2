'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomDayPicker from '@/components/CustomDayPicker';
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

import {
  addEmployeeSalaryIncrementData,
  updateEmployeeSalaryIncrementData,
} from '@/services/hr/edit-employee.service';

import { MessageErrorResponse } from '@/types';

const addSalaryIncrementSchema = z.object({
  empId: z.string(),
  incrementTitle: z.string().min(1, 'Title is required'),
  incrementAmount: z.coerce
    .number()
    .positive('Increment Amount must be a positive number'),
  desiredSalary: z.coerce.number(),
  appliedDate: z.date(),
});

export type AddSalaryIncrementFormData = z.infer<
  typeof addSalaryIncrementSchema
>;

interface SalaryIncrementDialogProps {
  empId?: string;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  editData?: {
    incrementId: string;
    incrementTitle: string;
    incrementAmount: number;
    desiredSalary: number;
    appliedDate: string;
  };
  refetchSalaryIncrementList: () => void;
}

export function SalaryIncrementDialog({
  empId,
  open,
  onOpenChange,
  onCloseChange,
  editData,
  refetchSalaryIncrementList,
}: SalaryIncrementDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddSalaryIncrementFormData>({
    resolver: zodResolver(addSalaryIncrementSchema),
    defaultValues: {
      empId: '',
      incrementTitle: '',
      incrementAmount: 0,
      desiredSalary: 0,
      appliedDate: new Date(),
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
  useEffect(() => {
    if (editData) {
      reset({
        empId: empId || '',
        incrementTitle: editData?.incrementTitle || '',
        incrementAmount: editData?.incrementAmount || 0,
        desiredSalary: editData?.desiredSalary || 0,
        appliedDate: new Date(editData?.appliedDate),
      });
    }
  }, [editData, reset, empId]);

  const { mutate, isPending } = useMutation({
    mutationFn: editData
      ? updateEmployeeSalaryIncrementData
      : addEmployeeSalaryIncrementData,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding employee!',
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
      onCloseChange();
      refetchSalaryIncrementList();
    },
  });

  const onSubmit = (data: AddSalaryIncrementFormData) => {
    mutate({
      ...data,
      empId: empId || '',
      incrementId: editData?.incrementId || '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Salary Increment' : 'Add Salary Increment'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="py-4">
          <div className="mb-4 flex flex-col gap-8">
            <div className="flex flex-col">
              <Label htmlFor="incrementTitle" className="mb-2 text-left">
                Increment Title <span className="text-sm text-red-500">*</span>
              </Label>
              <Controller
                name="incrementTitle"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="incrementTitle"
                    placeholder="Increment Title"
                  />
                )}
              />
              {errors.incrementTitle && (
                <span className="text-sm text-red-500">
                  {errors.incrementTitle.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="incrementAmount" className="mb-2 text-left">
                Increment Amount <span className="text-sm text-red-500">*</span>
              </Label>
              <Controller
                name="incrementAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="incrementAmount"
                    placeholder="10000"
                    type="number"
                  />
                )}
              />
              {errors.incrementAmount && (
                <span className="text-sm text-red-500">
                  {errors.incrementAmount.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="desiredSalary" className="mb-2 text-left">
                Desired Salary
              </Label>
              <Controller
                name="desiredSalary"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="desiredSalary"
                    placeholder="10000"
                    type="number"
                  />
                )}
              />
              {errors.desiredSalary && (
                <span className="text-sm text-red-500">
                  {errors.desiredSalary.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="appliedDate" className="mb-2 text-left">
                Applied Date
              </Label>
              <Controller
                name="appliedDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                  />
                )}
              />
              {errors.appliedDate && (
                <span className="text-sm text-red-500">
                  {errors.appliedDate.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {editData ? 'Edit Increment' : 'Add Increment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
