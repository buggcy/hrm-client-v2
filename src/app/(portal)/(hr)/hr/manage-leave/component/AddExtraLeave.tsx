import React, { useEffect, useState } from 'react';

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

import { ExtraLeaveType } from '@/libs/validations/manage-leave';
import {
  AddExtraLeave,
  UpdateExtraLeave,
} from '@/services/hr/manage.leave.service';

import { MessageErrorResponse } from '@/types';

interface ExtraLeaveModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  selectedEmployeeId: string;
  type: string;
  setRefetchManageLeaveList: (refetch: boolean) => void;
  leaveToEdit: ExtraLeaveType | null;
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
  type,
  setRefetchManageLeaveList,
  leaveToEdit,
}: ExtraLeaveModalProps) {
  const [date, setDate] = useState(new Date());
  const setDateValue = (date: Date | null) => {
    setDate(date || new Date());
  };
  useEffect(() => {
    if (type === 'edit' && leaveToEdit) {
      const month = leaveToEdit.month ?? new Date().getMonth() + 1;
      const year = leaveToEdit.year ?? new Date().getFullYear();
      const initialDate = new Date(year, month - 1, 1);
      setDate(initialDate);
    } else {
      setDate(new Date());
    }
  }, [leaveToEdit, type]);

  const initialDate = date;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddLeaveFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      allowed: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AddExtraLeave,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Leave Added Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchManageLeaveList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on adding the extra leaves!',
        variant: 'error',
      });
    },
  });
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
  useEffect(() => {
    if (type === 'edit' && leaveToEdit) {
      reset({
        title: leaveToEdit.title || '',
        allowed: String(leaveToEdit.leavesAllowed || ''),
      });
    }
  }, [leaveToEdit, type, reset]);

  const { mutate: EditMutate, isPending: EditPending } = useMutation({
    mutationFn: UpdateExtraLeave,
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Leave Updated Successfully!',
        variant: 'success',
      });
      reset();
      setRefetchManageLeaveList(true);
      onCloseChange(false);
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err.message || 'Error on updating the extra leaves!',
        variant: 'error',
      });
    },
  });
  useEffect(() => {
    if (!open) {
      if (type === 'edit' && leaveToEdit) {
        const month = leaveToEdit.month ?? new Date().getMonth() + 1;
        const year = leaveToEdit.year ?? new Date().getFullYear();
        const initialDate = new Date(year, month - 1, 1);
        setDate(initialDate);
      } else {
        setDate(new Date());
      }
    }
  }, [open, type, leaveToEdit]);
  const onSubmit = (data: AddLeaveFormData) => {
    const body = {
      leavesAllowed: Number(data?.allowed),
      month: date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
      }),
      title: data?.title,
    };
    const addPayload = {
      id: selectedEmployeeId,
      body,
    };
    const editPayload = {
      id: selectedEmployeeId,
      leaveId: leaveToEdit?._id || '',
      body,
    };
    if (type === 'add') {
      mutate(addPayload);
    } else {
      EditMutate(editPayload);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === 'add' ? 'Add Extra Leave' : 'Edit Extra Leave'}
            </DialogTitle>
          </DialogHeader>
          <form className="grid gap-8 py-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap">
              <div className="flex flex-1 flex-col">
                <Label htmlFor="title" className="mb-2 text-left">
                  Leave Title <span className="text-red-600">*</span>
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
                  Leave Allowed <span className="text-red-600">*</span>
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
                  Date <span className="text-red-600">*</span>
                </Label>
                <MonthPickerComponent
                  setDateValue={setDateValue}
                  initialDate={initialDate}
                  minDate={new Date()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={type === 'add' ? isPending : EditPending}
                size={'sm'}
              >
                {type === 'add' ? 'Add' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
