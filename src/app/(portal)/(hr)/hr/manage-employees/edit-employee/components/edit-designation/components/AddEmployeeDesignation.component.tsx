'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChevronDown } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

import { useTypesQuery } from '@/hooks/types.hook';
import { addEmployeeDesignationData } from '@/services/hr/edit-employee.service';

import { MessageErrorResponse } from '@/types';

const addDesignationSchema = z.object({
  empId: z.string(),
  position: z.string(),
});

export type AddDesignationFormData = z.infer<typeof addDesignationSchema>;

interface SalaryIncrementDialogProps {
  empId?: string;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  refetchDesignationList: () => void;
}

export function AddEmployeeDesignationDialog({
  empId,
  open,
  onOpenChange,
  onCloseChange,
  refetchDesignationList,
}: SalaryIncrementDialogProps) {
  const { data: types, isLoading } = useTypesQuery();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddDesignationFormData>({
    resolver: zodResolver(addDesignationSchema),
    defaultValues: {
      empId: '',
      position: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addEmployeeDesignationData,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message ||
          'Error on adding employee designation!',
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
      refetchDesignationList();
    },
  });

  const onSubmit = (data: AddDesignationFormData) => {
    mutate({
      ...data,
      id: empId || '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Designation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="py-4">
          <div className="mb-4 flex flex-col gap-8">
            <div className="flex flex-col">
              <Label htmlFor="position" className="mb-2 text-left">
                Position
              </Label>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No Designation" disabled>
                          Select designation
                        </SelectItem>
                        {types?.designationType.map((designation, index) => (
                          <SelectItem
                            key={index}
                            value={designation}
                            className="capitalize"
                          >
                            {designation}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.position && (
                <span className="text-sm text-red-500">
                  {errors.position.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || isLoading}>
              Add Designation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
