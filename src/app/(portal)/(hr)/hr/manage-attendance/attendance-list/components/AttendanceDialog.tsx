'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChevronDown } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useAttendanceUsersQuery } from '@/hooks/attendanceList/useEmployeesList.hook';
import { AttendanceListType } from '@/libs/validations/attendance-list';
import {
  addAttendaceData,
  getDateAttendance,
} from '@/services/hr/attendance-list.service';
import { AttendanceListStoreType } from '@/stores/hr/attendance-list';

import { MessageErrorResponse } from '@/types';

const timeFormatRegex = /^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;

const addAttendanceSchema = z
  .object({
    employee: z.string().min(1, 'Employee is required'),
    date: z.date(),
    inTime: z.string().min(8, 'Start Time is required'),
    outTime: z.string().min(8, 'End Time is required'),
    totalTime: z.coerce.number().min(1, 'Total Time is required'),
    Status: z.string().min(1, 'Status is required'),
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
  const [time, modifier] = timeStr.split(' ');
  let hours = time.split(':')[0];
  const minutes = time.split(':')[1];

  if (hours === '12') {
    hours = modifier === 'AM' ? '00' : '12';
  } else if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
}

export type AddAttendanceFormData = z.infer<typeof addAttendanceSchema>;

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
  type?: 'add' | 'edit';
  data?: AttendanceListType;
}

export function AttendanceDialog({
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
  } = useForm<AddAttendanceFormData>({
    resolver: zodResolver(addAttendanceSchema),
    defaultValues: {
      employee: type === 'edit' ? data?.user.Tahometer_ID : '',
      date:
        type === 'edit' && data?.date
          ? new Date(data.date)
          : new Date(new Date().setDate(new Date().getDate() - 1)),
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
      Status: type === 'edit' && data?.Status ? data.Status : '',
    },
  });

  const { attendanceListStore } = useStores() as {
    attendanceListStore: AttendanceListStoreType;
  };
  const { setRefetchAttendanceList } = attendanceListStore;
  const queryClient = useQueryClient();
  const inTime = watch('inTime');
  const outTime = watch('outTime');
  const date = watch('date');
  const employee = watch('employee');

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

  useEffect(() => {
    const fetchData = async () => {
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      if (open && employee) {
        const response = await getDateAttendance({
          date: formattedDate,
          id: employee,
        });
        const startTime = response?.Start_Date;
        const endTime = response?.End_Date;
        const status = response?.Status;
        const totalMinutes = response?.Total_Time;
        if (status) {
          setValue('Status', status);
        }
        if (totalMinutes) {
          setValue('totalTime', parseInt(totalMinutes, 10));
        }
        if (startTime) {
          const formattedStartTime = formatUTCToLocalTime(startTime);
          setValue('inTime', formattedStartTime);
        }
        if (endTime) {
          const formattedEndTime = formatUTCToLocalTime(endTime);
          setValue('outTime', formattedEndTime);
        }
        return response;
      }
    };

    void fetchData();
  }, [date, employee, open, setValue]);

  const { data: users, isLoading } = useAttendanceUsersQuery();

  const { mutate, isPending } = useMutation({
    mutationFn: addAttendaceData,
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
      void queryClient.invalidateQueries({
        queryKey: ['attendanceOverviewList'],
      });

      setRefetchAttendanceList(true);
    },
  });

  const onSubmit = (data: AddAttendanceFormData) => {
    const date = data.date;
    const formattedDate = date.toLocaleDateString('en-CA');

    const startTime24 = convertTo24Hour(data.inTime);
    const startDate = `${formattedDate}T${startTime24}+05:00`;

    const endTime24 = convertTo24Hour(data.outTime);
    const endDate = `${formattedDate}T${endTime24}+05:00`;

    mutate({
      employee: data.employee,
      inTime: startDate,
      outTime: endDate,
      totalTime: data.totalTime,
      Status: data.Status,
      date: data.date,
    });
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? 'Add' : 'Edit'} Attendance
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="employee" className="mb-2 text-left">
                Employee <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="employee"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No Employee" disabled>
                          Select Employee
                        </SelectItem>
                        {users?.users.map(user => (
                          <SelectItem
                            key={user._id}
                            value={user.Tahometer_ID || '0'}
                          >
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.employee && (
                <span className="text-sm text-red-500">
                  {errors.employee.message}
                </span>
              )}
            </div>
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
                      date >=
                        new Date(
                          new Date().setDate(new Date().getDate() - 1) + 1,
                        ) || date < new Date('1900-01-01')
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
              <Label htmlFor="Status" className="mb-2 text-left">
                Status <span className="text-red-600">*</span>
              </Label>
              <Controller
                name="Status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No Status" disabled>
                          Select Status
                        </SelectItem>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Leave">Leave</SelectItem>
                        <SelectItem value="Holiday">Holiday</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.Status && (
                <span className="text-sm text-red-500">
                  {errors.Status.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending || isLoading}>
              {type === 'add' ? 'Add' : 'Edit'} Attendance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
