'use client';

import React from 'react';

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
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { refreshAttendance } from '@/services/hr/attendance-list.service';
import { AuthStoreType } from '@/stores/auth';
import { AttendanceHistoryStoreType } from '@/stores/employee/attendance-history';

import { MessageErrorResponse } from '@/types';

const refreshAttendanceSchema = z.object({
  fromDate: z.date(),
  toDate: z.date(),
});

export type RefreshAttendanceFormData = z.infer<typeof refreshAttendanceSchema>;

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}

export function RefreshAttendanceDialog({
  open,
  onOpenChange,
  onCloseChange,
}: AttendanceDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RefreshAttendanceFormData>({
    resolver: zodResolver(refreshAttendanceSchema),
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
    },
  });
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const { attendanceHistoryStore } = useStores() as {
    attendanceHistoryStore: AttendanceHistoryStoreType;
  };
  const { setRefetchAttendanceHistoryList } = attendanceHistoryStore;

  const { mutate, isPending } = useMutation({
    mutationFn: refreshAttendance,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding attendance!',
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
      setRefetchAttendanceHistoryList(true);
    },
  });

  const onSubmit = (data: RefreshAttendanceFormData) => {
    mutate({
      userIds: [user?.Tahometer_ID || ''],
      from: data.fromDate.toLocaleDateString('en-CA'),
      to: data.toDate.toLocaleDateString('en-CA'),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        reset();
        onOpenChange();
      }}
    >
      <DialogContent className="md:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Refresh Attendance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="fromDate" className="mb-2 text-left">
                From <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="fromDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                  />
                )}
              />
              {errors.fromDate && (
                <span className="text-sm text-red-500">
                  {errors.fromDate.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="toDate" className="mb-2 text-left">
                To <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="toDate"
                control={control}
                render={({ field }) => (
                  <CustomDayPicker
                    initialDate={field.value}
                    onDateChange={field.onChange}
                    className="h-auto"
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                  />
                )}
              />
              {errors.toDate && (
                <span className="text-sm text-red-500">
                  {errors.toDate.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Refresh
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
