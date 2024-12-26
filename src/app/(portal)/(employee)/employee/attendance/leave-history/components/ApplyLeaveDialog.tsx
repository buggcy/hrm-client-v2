'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

import { LeaveHistoryListType } from '@/libs/validations/leave-history';
import {
  applyLeaveData,
  getLeaveData,
  updateLeaveRequest,
} from '@/services/employee/leave-history.service';
import { AuthStoreType } from '@/stores/auth';
import { LeaveHistoryStoreType } from '@/stores/employee/leave-history';
import { cn } from '@/utils';

import { EmployeeLeavesDataApiResponse } from '@/types/leave-history.types';

function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Month is 0-based, so subtract 1
  return date.toLocaleString('default', { month: 'long' }); // Use 'short' for abbreviated month names
}

function validateLeaveApplication(
  type: string,
  start: Date,
  end: Date,
  leaveData: EmployeeLeavesDataApiResponse | undefined,
) {
  const startYear = start.getFullYear();
  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();

  const endYear = end.getFullYear();
  const endMonth = end.getMonth() + 1;

  const totalDays =
    Math.abs((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const employeeLeave = leaveData;

  if (type === 'Annual') {
    const allowedAnnualLeaves = employeeLeave?.annualLeavesAllowed;

    if (endYear - startYear > 1) {
      toast({
        title: 'Error',
        description: 'Requested leaves exceed allowed amount.',
        variant: 'error',
      });
      return false;
    }

    if (endYear - startYear === 1) {
      const maxAllowedForTwoYears = 2 * (allowedAnnualLeaves ?? 0);
      if (totalDays > maxAllowedForTwoYears) {
        toast({
          title: 'Error',
          description: 'Requested leaves exceed allowed amount for two years.',
          variant: 'error',
        });
        return false;
      }
    }

    const leavesInStartYear = employeeLeave?.annualLeavesRecords.find(
      record => record.year === startYear,
    );
    const leavesInEndYear = employeeLeave?.annualLeavesRecords.find(
      record => record.year === endYear,
    );

    const remainingStartYearLeaves =
      (allowedAnnualLeaves ?? 0) -
      (leavesInStartYear ? leavesInStartYear.annualLeaves : 0);
    const remainingEndYearLeaves =
      (allowedAnnualLeaves ?? 0) -
      (leavesInEndYear ? leavesInEndYear.annualLeaves : 0);

    const daysInStartYear =
      startYear === endYear
        ? totalDays
        : new Date(startYear, 11, 31).getDate() - startDay + 1;
    const daysInEndYear = totalDays - daysInStartYear;

    if (daysInStartYear > remainingStartYearLeaves) {
      toast({
        title: 'Error',
        description: `Requested leaves exceed remaining leaves for ${startYear}.`,
        variant: 'error',
      });
      return false;
    }
    if (daysInEndYear > 0 && daysInEndYear > remainingEndYearLeaves) {
      toast({
        title: 'Error',
        description: `Requested leaves exceed remaining leaves for ${endYear}.`,
        variant: 'error',
      });
      return false;
    }
  }

  if (type === 'Casual' || type === 'Sick') {
    const allowedMonthlyLeaves = employeeLeave?.monthlyLeavesAllowed;

    if (endMonth - startMonth > 1 || endYear !== startYear) {
      toast({
        title: 'Error',
        description: 'Requested leaves exceed allowed amount.',
        variant: 'error',
      });
      return false;
    }

    const maxAllowedForTwoMonths = 2 * (allowedMonthlyLeaves ?? 0);
    if (endMonth - startMonth === 1 && totalDays > maxAllowedForTwoMonths) {
      toast({
        title: 'Error',
        description: 'Requested leaves exceed allowed amount for two months.',
        variant: 'error',
      });
      return false;
    }

    const leavesInStartMonth = employeeLeave?.monthlyLeaveRecords.find(
      record => record.year === startYear && record.month === startMonth,
    );
    const leavesInEndMonth = employeeLeave?.monthlyLeaveRecords.find(
      record => record.year === endYear && record.month === endMonth,
    );

    const remainingStartMonthLeaves =
      (allowedMonthlyLeaves ?? 0) -
      (leavesInStartMonth
        ? leavesInStartMonth['casualLeaves'] + leavesInStartMonth['sickLeaves']
        : 0);
    const remainingEndMonthLeaves =
      (allowedMonthlyLeaves ?? 0) -
      (leavesInEndMonth
        ? (leavesInStartMonth ? leavesInStartMonth['casualLeaves'] : 0) +
          (leavesInStartMonth ? leavesInStartMonth['sickLeaves'] : 0)
        : 0);

    const daysInStartMonth =
      startMonth === endMonth
        ? totalDays
        : new Date(startYear, startMonth, 0).getDate() - startDay + 1;
    const daysInEndMonth = totalDays - daysInStartMonth;

    if (daysInStartMonth > remainingStartMonthLeaves) {
      const month = getMonthName(startMonth);
      toast({
        title: 'Error',
        description: `Requested leaves exceed remaining leaves for ${month} ${startYear}.`,
        variant: 'error',
      });
      return false;
    }
    if (daysInEndMonth > 0 && daysInEndMonth > remainingEndMonthLeaves) {
      const month = getMonthName(endMonth);
      toast({
        title: 'Error',
        description: `Requested leaves exceed remaining leaves for ${month} ${endYear}.`,
        variant: 'error',
      });
      return false;
    }
  }
  return true;
}

const applyLeaveSchema = z
  .object({
    User_ID: z.string(),
    Start_Date: z.date(),
    End_Date: z.date(),
    Status: z.string(),
    Title: z.string().min(1, 'Title is required'),
    Leave_Type: z.string().min(1, 'Leave Type is required'),
    Description: z.string().min(1, 'Description is required'),
    proofDocument: z
      .instanceof(File)
      .nullable()
      .refine(file => file === null || file.size <= 5 * 1024 * 1024, {
        message: 'File size should be less than 5MB',
      }),
  })
  .refine(data => data.Start_Date <= data.End_Date, {
    message: 'End date should be greater than start date',
  });

export type ApplyLeaveFormData = z.infer<typeof applyLeaveSchema>;

interface DialogDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseChange: (open: boolean) => void;
  data?: LeaveHistoryListType;
  id?: string;
}

export function ApplyLeaveDialog({
  open,
  onOpenChange,
  onCloseChange,
  data,
  id,
}: DialogDemoProps) {
  const { leaveHistoryStore } = useStores() as {
    leaveHistoryStore: LeaveHistoryStoreType;
  };
  const { setRefetchLeaveHistoryList } = leaveHistoryStore;
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyLeaveFormData>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      User_ID: user?.id || '',
      Start_Date: data?.Start_Date ? new Date(data.Start_Date) : undefined,
      End_Date: data?.End_Date ? new Date(data.End_Date) : undefined,
      Status: 'Pending',
      Title: data?.Title || '',
      Leave_Type: data?.Leave_Type || '',
      Description: data?.Description || '',
      proofDocument: null,
    },
  });

  const { mutate: applyLeave, isPending: isApplying } = useMutation({
    mutationFn: applyLeaveData,
    onError: err => {
      toast({
        title: 'Error',
        description:
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Error on applying for leave!',
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
      onCloseChange(false);
      setRefetchLeaveHistoryList(true);
    },
  });

  const { mutate: updateLeave, isPending: isUpdating } = useMutation({
    mutationFn: updateLeaveRequest,
    onError: err => {
      toast({
        title: 'Error',
        description:
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Error on applying for leave!',
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
      onCloseChange(false);
      setRefetchLeaveHistoryList(true);
    },
  });

  const { mutate: fetchLeaveData, data: leaveData } = useMutation({
    mutationFn: ({ employeeId }: { employeeId: string }) =>
      getLeaveData({
        employeeId,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching stats data!',
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (user) {
      fetchLeaveData({
        employeeId: user?.id ? user.id : '',
      });
    }
  }, [user, fetchLeaveData]);

  const onSubmit = (form: ApplyLeaveFormData) => {
    const start = new Date(form.Start_Date);
    const end = new Date(form.End_Date);
    const type = form.Leave_Type;
    if (!validateLeaveApplication(type, start, end, leaveData)) {
      return;
    }
    const startDateLocal = new Date(form.Start_Date);
    const endDateLocal = new Date(form.End_Date);

    const startDateUtcPlus5 = new Date(
      startDateLocal.getTime() + 5 * 60 * 60 * 1000,
    );
    const endDateUtcPlus5 = new Date(
      endDateLocal.getTime() + 5 * 60 * 60 * 1000,
    );
    const formData = new FormData();
    formData.append('User_ID', user?.id || '');
    formData.append('Start_Date', startDateUtcPlus5.toISOString());
    formData.append('End_Date', endDateUtcPlus5.toISOString());
    formData.append('Status', 'Pending');
    formData.append('Title', form.Title);
    formData.append('Leave_Type', form.Leave_Type);
    formData.append('Description', form.Description);
    if (form.proofDocument) {
      formData.append('proofDocument', form.proofDocument);
    }
    if (data) {
      updateLeave({
        id: id || '',
        body: formData,
      });
    } else {
      applyLeave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[905px]">
        <DialogHeader>
          <DialogTitle> {data ? 'Edit' : 'Apply For'} Leave</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-center gap-4">
            <div className="flex flex-col">
              <Label htmlFor="Start_Date" className="mb-2 text-left">
                Start Date
              </Label>
              <Controller
                name="Start_Date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.Start_Date && (
                <span className="text-sm text-red-500">
                  {errors.Start_Date.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="End_Date" className="mb-2 text-left">
                End Date
              </Label>
              <Controller
                name="End_Date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.End_Date && (
                <span className="text-sm text-red-500">
                  {errors.End_Date.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="Title" className="mb-2 text-left">
                Title
              </Label>
              <Controller
                name="Title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="Title"
                    placeholder="Title"
                    className="w-full"
                  />
                )}
              />
              {errors.Title && (
                <span className="text-sm text-red-500">
                  {errors.Title.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="Leave_Type" className="mb-2 text-left">
                Leave Type
              </Label>
              <Controller
                name="Leave_Type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative z-50 w-full rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="N" disabled>
                          Select Leave Type
                        </SelectItem>
                        <SelectItem value="Casual">Casual Leave</SelectItem>
                        <SelectItem value="Sick">Sick Leave</SelectItem>
                        <SelectItem value="Annual">Annual Leave</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                    <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                  </Select>
                )}
              />
              {errors.Leave_Type && (
                <span className="text-sm text-red-500">
                  {errors.Leave_Type.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="Description" className="mb-2 text-left">
                Description
              </Label>
              <Controller
                name="Description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="Description"
                    placeholder="Description"
                  />
                )}
              />
              {errors.Description && (
                <span className="text-sm text-red-500">
                  {errors.Description.message}
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
            <Button type="submit" disabled={isApplying || isUpdating}>
              {data ? 'Edit' : 'Apply For'} Leave
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
