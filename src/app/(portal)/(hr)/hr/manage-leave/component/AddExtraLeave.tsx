import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { MonthPickerComponent } from '@/components/MonthPicker';
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

import { AddAllowedLeave } from '@/services/hr/manage.leave.service';

import { MessageErrorResponse } from '@/types';

interface ExtraLeaveModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  selectedEmployeeId: string;
  refetch: () => void;
}

const FormSchema = z.object({
  title: z.string().min(1, 'Leave Title is required'),
  allowed: z.string().min(1, 'Leave Allowed is required'),
});

export type AddLeaveFormData = z.infer<typeof FormSchema>;
export function AddExtraLeaveModal({
  open,
  onCloseChange,
  selectedEmployeeId,
  refetch,
}: ExtraLeaveModalProps) {
  const [date, setDate] = useState(new Date());
  const initialDate = new Date();
  const setDateValue = (date: Date | null) => {
    setDate(date || new Date());
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddLeaveFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      allowed: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AddAllowedLeave,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Leave Added Successfully!',
      });
      refetch();
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on adding the extra leaves!',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: AddLeaveFormData) => {
    const body = {
      leavesAllowed: Number(data?.allowed),
      month: date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
      }),
      title: data?.title,
    };
    const payload = {
      id: selectedEmployeeId,
      body,
    };
    mutate(payload);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'Add Extra Leave'}</DialogTitle>
          </DialogHeader>
          <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap">
              <div className="flex flex-1 flex-col">
                <Label htmlFor="title" className="mb-2 text-left">
                  Leave Title
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="title"
                      placeholder="Please Enter Leave Title"
                      {...field}
                    />
                  )}
                />
                {errors.title && (
                  <span className="text-sm text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="flex flex-1 flex-col">
                <Label htmlFor="allow" className="mb-2 text-left">
                  Leave Allowed
                </Label>
                <Controller
                  name="allowed"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      id="allow"
                      placeholder="Please Enter Leave Allowed"
                      {...field}
                    />
                  )}
                />
                {errors.allowed && (
                  <span className="text-sm text-red-500">
                    {errors.allowed.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="flex flex-1 flex-col">
                <Label htmlFor="month" className="mb-2 text-left">
                  Date
                </Label>
                <MonthPickerComponent
                  setDateValue={setDateValue}
                  initialDate={initialDate}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending} size={'sm'}>
                {'Add'}
              </Button>
              <Button
                variant="ghostSecondary"
                type="button"
                onClick={() => onCloseChange(false)}
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
