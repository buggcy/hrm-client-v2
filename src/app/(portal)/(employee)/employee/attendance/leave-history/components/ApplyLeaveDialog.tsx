'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ChevronDown, Eye } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomDayPicker from '@/components/CustomDayPicker';
import TimePicker from '@/components/TimePicker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useConfigurationQuery } from '@/hooks/hr/useConfigurationList.hook';
import { LeaveListType } from '@/libs/validations/hr-leave-list';
import {
  applyLeaveData,
  getLeaveData,
  updateLeaveRequest,
} from '@/services/employee/leave-history.service';
import { AuthStoreType } from '@/stores/auth';
import { LeaveHistoryStoreType } from '@/stores/employee/leave-history';

import distributeLeaves, { getTotalDays } from './LeaveDistributionCalculator';

const applyLeaveSchema = z
  .object({
    User_ID: z.string(),
    Start_Date: z.date(),
    End_Date: z.date(),
    Status: z.string(),
    Title: z.string().min(1, 'Title is required'),
    Leave_Type: z.string().min(1, 'Leave Type is required'),
    Leave_Duration: z.string().min(1, 'Leave Time is required'),
    Leave_Duration_Start: z.string(),
    Leave_Duration_End: z.string(),
    Description: z.string().min(1, 'Description is required'),
    proofDocument: z
      .instanceof(File)
      .nullable()
      .refine(file => file === null || file.size <= 800 * 1024, {
        message: 'File size should be less than 800KB',
      }),
    allowAnnual: z.boolean().optional(),
  })
  .refine(data => data.Start_Date <= data.End_Date, {
    message: 'End date must be greater than or equal to the start date',
    path: ['End_Date'],
  })
  .refine(
    data => {
      const startDate = new Date(data.Start_Date);
      return startDate.getDay() !== 0 && startDate.getDay() !== 6;
    },
    {
      message: 'Start date cannot be on weekends',
      path: ['Start_Date'],
    },
  )
  .refine(
    data => {
      const endDate = new Date(data.End_Date);
      return endDate.getDay() !== 0 && endDate.getDay() !== 6;
    },
    {
      message: 'End date cannot be on weekends',
      path: ['End_Date'],
    },
  )
  .refine(
    data => {
      const startDate = new Date(data.Start_Date);
      const endDate = new Date(data.End_Date);
      const totalDays = getTotalDays(startDate, endDate);
      return totalDays <= 15;
    },
    {
      message: 'Leave duration cannot exceed 15 days',
      path: ['End_Date'],
    },
  )
  .refine(
    data => {
      const startDate = new Date(data.Start_Date);
      const endDate = new Date(data.End_Date);
      return !(
        startDate.getDate() !== endDate.getDate() &&
        data.Leave_Duration !== 'Full'
      );
    },
    {
      message: 'Half day or quarter day leave cannot span multiple days',
      path: ['Leave_Duration'],
    },
  );

export type ApplyLeaveFormData = z.infer<typeof applyLeaveSchema>;

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

interface DialogDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseChange: (open: boolean) => void;
  data?: LeaveListType;
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
  const [leaveDistribution, setLeaveDistribution] = useState<
    { leaves: number; unpaidLeaves: number; annualLeaves?: number } | undefined
  >({
    leaves: 0,
    unpaidLeaves: 0,
    annualLeaves: 0,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ApplyLeaveFormData>({
    resolver: zodResolver(applyLeaveSchema),
    mode: 'onChange',
    defaultValues: {
      User_ID: user?.id || '',
      Start_Date: data?.Start_Date ? new Date(data.Start_Date) : undefined,
      End_Date: data?.End_Date ? new Date(data.End_Date) : undefined,
      Status: 'Pending',
      Title: data?.Title || '',
      Leave_Type: data?.Leave_Type || '',
      Leave_Duration: data?.Leave_Duration || '',
      Leave_Duration_Start: data?.Start_Date
        ? new Date(data.Start_Date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',

      Leave_Duration_End: data?.End_Date
        ? new Date(data.End_Date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',

      Description: data?.Description || '',
      proofDocument: null,
      allowAnnual: data?.allowAnnual ? true : false,
    },
  });
  const startDate = watch('Start_Date');
  const endDate = watch('End_Date');
  const leaveType = watch('Leave_Type');
  const allowAnnual = watch('allowAnnual');
  const Leave_Duration = watch('Leave_Duration');
  const { data: typesData } = useConfigurationQuery({
    page: 1,
    limit: 1,
    status: 'timecutoff',
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);
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

  useEffect(() => {
    if (startDate && endDate && leaveType && leaveData) {
      setLeaveDistribution(
        distributeLeaves(
          leaveType as 'Casual' | 'Sick' | 'Annual',
          startDate,
          endDate,
          leaveData,
          new Date(user?.Joining_Date || '') || new Date(),
        ),
      );
    }
  }, [startDate, endDate, leaveType, leaveData, user?.Joining_Date]);

  const onSubmit = (form: ApplyLeaveFormData) => {
    if (form.Start_Date.getDay() === 0 || form.Start_Date.getDay() === 6) {
      toast({
        title: 'Error',
        description: 'Start date cannot be on weekends!',
        variant: 'error',
      });
      return;
    }
    if (form.End_Date.getDay() === 0 || form.End_Date.getDay() === 6) {
      toast({
        title: 'Error',
        description: 'End date cannot be on weekends!',
        variant: 'error',
      });
      return;
    }
    const totalDays = getTotalDays(form.Start_Date, form.End_Date);
    if (totalDays > 15) {
      toast({
        title: 'Error',
        description:
          'Leave duration cannot exceed 15 days. Submit multiple requests if needed.',
        variant: 'error',
      });
      return;
    }

    const startDateFormatted = form.Start_Date.toLocaleDateString('en-CA');
    const endDateFormatted = form.End_Date.toLocaleDateString('en-CA');
    const startTime = convertTo24Hour(
      Leave_Duration === 'Full' ? '00:00 AM' : form.Leave_Duration_Start,
    );
    const endTime = convertTo24Hour(
      Leave_Duration === 'Full' ? '00:00 AM' : form.Leave_Duration_End,
    );
    const startDate = `${startDateFormatted}T${startTime}+${Leave_Duration === 'Full' ? '00:00' : '05:00'}`;
    const endDate = `${endDateFormatted}T${endTime}+${Leave_Duration === 'Full' ? '00:00' : '05:00'}`;
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    const timeDiff = Math.abs(sd.getTime() - ed.getTime()) / (1000 * 3600);
    if (
      Leave_Duration === 'Half' &&
      typesData?.data[0]?.timeCutOff &&
      timeDiff > typesData?.data[0]?.timeCutOff / 120
    ) {
      toast({
        title: 'Error',
        description: `Leave duration cannot exceed ${typesData?.data[0]?.timeCutOff / 120} hours for half-day leave.`,
        variant: 'error',
      });
      return;
    }
    if (
      Leave_Duration === 'Quarter' &&
      typesData?.data[0]?.timeCutOff &&
      timeDiff > typesData?.data[0]?.timeCutOff / 240
    ) {
      toast({
        title: 'Error',
        description: `Leave duration cannot exceed ${typesData?.data[0]?.timeCutOff / 240} hours for quarter-day leave.`,
        variant: 'error',
      });
      return;
    }
    const formData = new FormData();
    formData.append('User_ID', user?.id || '');
    formData.append('Start_Date', startDate);
    formData.append('End_Date', endDate);
    formData.append('Status', 'Pending');
    formData.append('Title', form.Title);
    formData.append('Leave_Type', form.Leave_Type);
    formData.append('Leave_Duration', form.Leave_Duration);
    formData.append('Description', form.Description);
    if (form.proofDocument) {
      formData.append('proofDocument', form.proofDocument);
    }
    formData.append('allowAnnual', allowAnnual?.toString() || '');
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle> {data ? 'Edit' : 'Apply For'} Leave</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-4">
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex w-full flex-col">
                <Label htmlFor="Start_Date" className="mb-2 text-left">
                  Start Date
                </Label>
                <Controller
                  name="Start_Date"
                  control={control}
                  render={({ field }) => (
                    <CustomDayPicker
                      initialDate={field.value}
                      onDateChange={field.onChange}
                      className="h-auto"
                      // disabled={date => {
                      //   const currentDate = new Date();
                      //   const startOfCurrentMonth = new Date(
                      //     currentDate.getFullYear(),
                      //     currentDate.getMonth(),
                      //     1,
                      //   );
                      //   return date < startOfCurrentMonth;
                      // }}
                    />
                  )}
                />
                {errors.Start_Date && (
                  <span className="text-sm text-red-500">
                    {errors.Start_Date.message}
                  </span>
                )}
              </div>
              <div className="flex w-full flex-col">
                <Label htmlFor="End_Date" className="mb-2 text-left">
                  End Date
                </Label>
                <Controller
                  name="End_Date"
                  control={control}
                  render={({ field }) => (
                    <CustomDayPicker
                      initialDate={field.value}
                      onDateChange={field.onChange}
                      className="h-auto"
                      // disabled={date => {
                      //   const currentDate = new Date();
                      //   const startOfCurrentMonth = new Date(
                      //     currentDate.getFullYear(),
                      //     currentDate.getMonth(),
                      //     1,
                      //   );
                      //   return date < startOfCurrentMonth;
                      // }}
                    />
                  )}
                />
                {errors.End_Date && (
                  <span className="text-sm text-red-500">
                    {errors.End_Date.message}
                  </span>
                )}
              </div>
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
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-col">
                <Label htmlFor="Leave_Duration" className="mb-2 text-left">
                  Leave Time
                </Label>
                <Controller
                  name="Leave_Duration"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="relative z-50 w-full rounded-md border px-3 py-2 text-left text-sm">
                        <SelectValue placeholder="Select Leave Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="text-sm">
                          <SelectItem value="None" disabled>
                            Select Leave Time
                          </SelectItem>
                          <SelectItem value="Full">Full Day</SelectItem>
                          <SelectItem value="Half">Half Day</SelectItem>
                          <SelectItem value="Quarter">Quarter Day</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                      <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
                    </Select>
                  )}
                />
                {errors.Leave_Duration && (
                  <span className="mt-2 text-sm text-red-500">
                    {errors.Leave_Duration.message}
                  </span>
                )}
              </div>
              {Leave_Duration && Leave_Duration !== 'Full' && (
                <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
                  <div className="flex w-full flex-1 flex-col">
                    <Label htmlFor="inTime" className="mb-2 text-left">
                      Start Time <span className="text-red-600">*</span>
                    </Label>
                    <Controller
                      name="Leave_Duration_Start"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          time={field.value}
                          onTimeChange={field.onChange}
                        />
                      )}
                    />
                    {errors.Leave_Duration_Start && (
                      <span className="text-sm text-red-500">
                        {errors.Leave_Duration_Start.message}
                      </span>
                    )}
                  </div>
                  <div className="flex w-full flex-1 flex-col">
                    <Label htmlFor="inTime" className="mb-2 text-left">
                      End Time <span className="text-red-600">*</span>
                    </Label>
                    <Controller
                      name="Leave_Duration_End"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          time={field.value}
                          onTimeChange={field.onChange}
                        />
                      )}
                    />
                    {errors.Leave_Duration_End && (
                      <span className="text-sm text-red-500">
                        {errors.Leave_Duration_End.message}
                      </span>
                    )}
                  </div>
                </div>
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
              <Label htmlFor="Description" className="mb-2 text-left">
                Description
              </Label>
              <Controller
                name="Description"
                control={control}
                render={({ field }) => (
                  <FormattedTextArea
                    value={field.value || ''}
                    onChange={field.onChange}
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
                Choose Document{' '}
                {data && data?.Proof_Document && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Eye
                            className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                            onClick={() =>
                              data?.Proof_Document &&
                              window.open(
                                String(data?.Proof_Document),
                                '_blank',
                              )
                            }
                            size={18}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Click to Preview Document</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
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
            {(leaveDistribution?.unpaidLeaves &&
              leaveDistribution?.unpaidLeaves > 0) ||
            (leaveDistribution?.annualLeaves &&
              leaveDistribution?.annualLeaves > 0 &&
              (leaveType === 'Casual' || leaveType === 'Sick')) ? (
              <div className="flex w-full flex-col gap-4">
                <Badge
                  variant="warning"
                  className="rounded-md p-2 text-sm normal-case"
                >
                  Note: You&apos;ve exceeded your {leaveType} Leave quota.
                  Remaining leaves can be deducted from annual leave or marked
                  as unpaid.
                </Badge>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-4">
                    <Controller
                      name="allowAnnual"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="allowAnnual"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="allowAnnual" className="mb-0 text-left">
                      Allow Annual Leaves Deduction
                    </Label>
                  </div>
                  {allowAnnual && (
                    <Badge
                      variant="warning"
                      className="rounded-md p-2 text-sm normal-case"
                    >
                      HR will decide the allocation if you choose annual leave.
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div></div>
            )}
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
