'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment-timezone';
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
import FormattedTextArea from '@/components/ui/FormattedTextArea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  calculateTimeDifference,
  convertTo24Hour,
  formatUTCToLocalTime,
  timeFormatRegex,
} from '@/app/(portal)/(hr)/hr/manage-attendance/attendance-list/components/AttendanceDialog';
import { useAttendanceByDateQuery } from '@/hooks/attendanceList/useAttendanceList.hook';
import { AttendanceRequestType } from '@/libs/validations/attendance-history';
import { requestAttendance } from '@/services/employee/attendance-request.service';
import { AuthStoreType } from '@/stores/auth';
import { AttendanceRequestStoreType } from '@/stores/employee/attendance-request';

import { MessageErrorResponse } from '@/types';

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
      .refine(file => file === null || file.size <= 800 * 1024, {
        message: 'File size should be less than 800KB',
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
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const selectedDate = watch('date');
  const { data: attendanceByDate } = useAttendanceByDateQuery(
    user?.id || '',
    selectedDate ? selectedDate.toLocaleDateString('en-CA') : '',
    {
      enabled: !!user?.id && !!selectedDate,
    },
  );

  const { attendanceRequestStore } = useStores() as {
    attendanceRequestStore: AttendanceRequestStoreType;
  };
  const { setRefetchAttendanceRequestList } = attendanceRequestStore;

  const inTime = watch('inTime');
  const outTime = watch('outTime');
  useEffect(() => {
    if (attendanceByDate?.data) {
      const startUTC = attendanceByDate.data.Start_Date;
      const endUTC = attendanceByDate.data.End_Date;
      const totalTime = attendanceByDate.data.Total_Time;

      const startTime =
        startUTC && moment(startUTC).utc().format('HH:mm') === '00:00'
          ? '00:00'
          : moment(startUTC).tz('Asia/Karachi').format('H:mm');

      const endTime =
        endUTC && moment(endUTC).utc().format('HH:mm') === '00:00'
          ? '00:00'
          : moment(endUTC).tz('Asia/Karachi').format('H:mm');

      setValue('inTime', startTime);
      setValue('outTime', endTime);
      setValue('totalTime', totalTime ? parseInt(totalTime, 10) : 0);
    }
  }, [attendanceByDate, setValue]);

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
                    disabled={date => {
                      const today = new Date();

                      const startOfMonth = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1,
                      );

                      return (
                        date < startOfMonth ||
                        date.getMonth() !== today.getMonth() ||
                        date.getFullYear() !== today.getFullYear() ||
                        date >=
                          new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate(),
                          )
                      );
                    }}
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
            <div className="col-span-full flex flex-1 flex-col">
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
            <div className="col-span-full flex flex-1 flex-col">
              <Label htmlFor="reason" className="mb-2 text-left">
                Reason <span className="text-red-600">*</span>
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
              {errors.reason && (
                <span className="text-sm text-red-500">
                  {errors.reason.message}
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
