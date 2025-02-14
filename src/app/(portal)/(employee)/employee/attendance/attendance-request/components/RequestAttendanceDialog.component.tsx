'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomDayPicker from '@/components/CustomDayPicker';
import TimePicker from '@/components/TimePicker';
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

import { AttendanceRequestType } from '@/libs/validations/attendance-history';
import { requestAttendance } from '@/services/employee/attendance-request.service';
import { AuthStoreType } from '@/stores/auth';
import { AttendanceRequestStoreType } from '@/stores/employee/attendance-request';

import { MessageErrorResponse } from '@/types';

const timeFormatRegex = /^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;

const requestAttendanceSchema = z
  .object({
    date: z.date(),
    inTime: z.string().min(8, 'Start Time is required'),
    outTime: z.string().min(8, 'End Time is required'),
    totalTime: z.coerce.number().min(1, 'Total Time is required'),
    reason: z.string().min(1, 'Reason is required'),
    proofDocument: z
      .instanceof(File)
      .nullable()
      .refine(file => file === null || file.size <= 5 * 1024 * 1024, {
        message: 'File size should be less than 5MB',
      }),
  })
  .refine(data => timeFormatRegex.test(data.inTime), {
    path: ['inTime'],
    message: 'Start Time must be in the format HH:MM AM/PM',
  })
  .refine(data => timeFormatRegex.test(data.outTime), {
    path: ['outTime'],
    message: 'End Time must be in the format HH:MM AM/PM',
  })
  .refine(data => !data.date || data.date <= new Date(), {
    path: ['date'],
    message: 'Date cannot be in the future',
  });

export function formatUTCToLocalTime(utcDateString: string) {
  const utcDate = new Date(utcDateString);

  utcDate.setHours(utcDate.getHours());

  const hours = utcDate.getHours();
  const minutes = utcDate.getMinutes();

  const amPm = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = hours % 12 || 12;
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours.toString().padStart(2, '0')}:${formattedMinutes} ${amPm}`;
}

export function convertTo24Hour(timeStr: string) {
  const [time, modifier] = timeStr.split(' '); // Split time and AM/PM part
  let hours = time.split(':')[0];
  const minutes = time.split(':')[1];

  if (hours === '12') {
    hours = modifier === 'AM' ? '00' : '12';
  } else if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
}

export type RequestAttendanceFormData = z.infer<typeof requestAttendanceSchema>;

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  type?: 'add' | 'edit';
  data?: AttendanceRequestType;
}

export function RequestAttendanceDialog({
  open,
  onOpenChange,
  onCloseChange,
  type,
  data,
}: AttendanceDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<RequestAttendanceFormData>({
    resolver: zodResolver(requestAttendanceSchema),
    defaultValues: {
      date: type === 'edit' && data?.date ? new Date(data.date) : undefined,
      inTime:
        type === 'edit' && data?.Start_Date
          ? formatUTCToLocalTime(data.Start_Date)
          : '',
      outTime:
        type === 'edit' && data?.End_Date
          ? formatUTCToLocalTime(data.End_Date ?? '')
          : '',
      totalTime:
        type === 'edit' && data?.Total_Time ? parseInt(data.Total_Time, 10) : 0,
      reason: type === 'edit' && data?.reason ? data.reason : '',
      proofDocument: null,
    },
  });

  const { attendanceRequestStore } = useStores() as {
    attendanceRequestStore: AttendanceRequestStoreType;
  };
  const { setRefetchAttendanceRequestList } = attendanceRequestStore;
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const inTime = watch('inTime');
  const outTime = watch('outTime');

  const calculateTimeDifference = (startTime: string, endTime: string) => {
    const parseTime = (time: string) => {
      const [hour, minute, period] = time.split(/[: ]/);
      const hours = (parseInt(hour, 10) % 12) + (period === 'PM' ? 12 : 0);
      return { hours, minutes: parseInt(minute, 10) };
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    const startDate = new Date();
    startDate.setHours(start.hours, start.minutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(end.hours, end.minutes, 0, 0);

    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / 1000 / 60,
    );

    return differenceInMinutes;
  };

  useEffect(() => {
    if (inTime && outTime) {
      const totalMinutes = calculateTimeDifference(inTime, outTime);
      setValue('totalTime', totalMinutes >= 0 ? totalMinutes : 0);
    }
  }, [inTime, outTime, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: requestAttendance,
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
      setRefetchAttendanceRequestList(true);
    },
  });

  const onSubmit = (data: RequestAttendanceFormData) => {
    const date = data.date;
    const formattedDate = date.toLocaleDateString('en-CA');

    const startTime24 = convertTo24Hour(data.inTime);
    const startDate = `${formattedDate}T${startTime24}+05:00`;

    const endTime24 = convertTo24Hour(data.outTime);
    const endDate = `${formattedDate}T${endTime24}+05:00`;

    const formData = new FormData();

    formData.append('userId', user?.id ?? '');
    formData.append('date', date.toLocaleDateString('en-CA'));
    formData.append('Start_Date', startDate);
    formData.append('End_Date', endDate);
    formData.append('Total_Time', data.totalTime.toString());
    formData.append('reason', data.reason);

    if (data.proofDocument) {
      formData.append('Document', data.proofDocument);
    }
    mutate(formData);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        reset();
        onOpenChange();
      }}
    >
      <DialogContent className="md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {' '}
            {type === 'add' ? 'Add' : 'Edit'} Attendance Request
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="date" className="mb-2 text-left">
                Date <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="date"
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
              {errors.date && (
                <span className="text-sm text-red-500">
                  {errors.date.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="inTime" className="mb-2 text-left">
                Start Time <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="inTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    time={field.value}
                    onTimeChange={field.onChange}
                  />
                )}
              />
              {errors.inTime && (
                <span className="text-sm text-red-500">
                  {errors.inTime.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="outTime" className="mb-2 text-left">
                End Time <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="outTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    time={field.value}
                    onTimeChange={field.onChange}
                  />
                )}
              />
              {errors.outTime && (
                <span className="text-sm text-red-500">
                  {errors.outTime.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="totalTime" className="mb-2 text-left">
                Total Time <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="totalTime"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="totalTime"
                    placeholder="Minutes"
                    type="number"
                  />
                )}
              />
              {errors.totalTime && (
                <span className="text-sm text-red-500">
                  {errors.totalTime.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <Label htmlFor="reason" className="mb-2 text-left">
                Status <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="reason"
                    placeholder="Reason"
                    className="w-full"
                  />
                )}
              />
              {errors.reason && (
                <span className="text-sm text-red-500">
                  {errors.reason.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="proofDocument" className="mb-2 text-left">
                Choose Document
              </Label>
              <Controller
                name="proofDocument"
                control={control}
                render={({ field }) => (
                  <Input
                    id="proofDocument"
                    placeholder="Choose a file"
                    type="file"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                )}
              />
              {errors.proofDocument && (
                <span className="text-sm text-red-500">
                  {errors.proofDocument.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Request Attendance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
